/**
 * Claude web search functionality
 * This file contains implementation of web search using Anthropic Claude API
 * Can be used as reference for future implementations
 */

import { Anthropic } from "@anthropic-ai/sdk";
import { Buffer } from "buffer";
import dotenv from "dotenv";
dotenv.config();

/**
 * Interface for web search citation sources
 */
export interface WebSearchSource {
  url: string;
  title: string;
  text: string; // cited_text from the API response
}

/**
 * Search for furniture information online using Claude 3.7 model with web search tool
 * @param imageBuffer Buffer containing the image to search for
 * @returns Object containing search results and sources
 */
export async function searchFurnitureWithClaude(
  imageBuffer: Buffer
): Promise<{ text: string; sources: WebSearchSource[] }> {
  const timestamp = new Date().toISOString();
  console.log(
    `[${timestamp}] Searching online for furniture matches with Claude...`
  );

  // Direct Anthropic SDK approach (using native SDK)
  const anthropicClient = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY || "",
  });

  try {
    // Convert buffer to base64
    const base64Image = imageBuffer.toString("base64");

    // Make API request using Anthropic native SDK
    const response = await anthropicClient.messages.create({
      model: "claude-3-7-sonnet-latest",
      max_tokens: 20000,
      thinking: {
        type: "enabled",
        budget_tokens: 16000,
      },
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: "Look at this furniture image. Identify the most likely brand and model of this furniture piece. Search the web for information about similar furniture pieces, especially Scandinavian design from brands like Artek, Isku, Martela, Avarte, Nikari, and Secto Design. Give a detailed analysis with sources.",
            },
            {
              type: "image",
              source: {
                type: "base64",
                media_type: "image/jpeg",
                data: base64Image,
              },
            },
          ],
        },
      ],
      tools: [
        {
          type: "web_search_20250305",
          name: "web_search",
          max_uses: 5,
          user_location: {
            type: "approximate",
            country: "FI",
          },
        },
      ],
    });

    console.log("Claude search complete");

    // Extract text content from the response
    const searchText = response.content
      .filter((block) => block.type === "text")
      .map((block) => block.text)
      .join("\n");

    // Process and collect citations/sources from the response
    const sources: WebSearchSource[] = [];

    // Extract citations from the response
    response.content.forEach((block) => {
      if (
        block.type === "text" &&
        "citations" in block &&
        Array.isArray(block.citations)
      ) {
        block.citations.forEach((citation) => {
          if (
            citation.type === "web_search_result_location" &&
            !sources.some((source) => source.url === citation.url)
          ) {
            sources.push({
              url: citation.url,
              title: citation.title || "",
              text: citation.cited_text || "",
            });
          }
        });
      }
    });

    // Log usage information
    if (response.usage) {
      console.log(
        `Web search usage: ${JSON.stringify({
          input_tokens: response.usage.input_tokens,
          output_tokens: response.usage.output_tokens,
          searches: response.usage.server_tool_use?.web_search_requests || 0,
        })}`
      );
    }

    return {
      text: searchText,
      sources,
    };
  } catch (error) {
    console.error(
      `[${timestamp}] Error during furniture search with Claude:`,
      error
    );
    return { text: "Web search with Claude failed", sources: [] };
  }
}
