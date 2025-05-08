/**
 * Utility for timing operations and logging results in a consistent format
 */

/**
 * Timer utility for AI model analysis operations
 * Creates consistent timing and logging of model operations
 */
export class AnalysisTimer {
  private startTime: number;
  private modelName: string;
  
  /**
   * Create a new timer instance for a specific model
   * @param modelName Name of the AI model being used
   */
  constructor(modelName: string) {
    this.modelName = modelName;
    this.startTime = Date.now();
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] Starting ${this.modelName} analysis...`);
  }

  /**
   * Stop the timer and log the results including model detection results
   * @param merkki The brand detected by the model
   * @param malli The model detected by the model
   * @returns Duration in milliseconds
   */
  stop(merkki?: string, malli?: string): number {
    const endTime = Date.now();
    const duration = endTime - this.startTime;
    const durationSeconds = (duration / 1000).toFixed(2) + "s";
    const timestampEnd = new Date().toISOString();
    
    console.log(`[${timestampEnd}] ${this.modelName} completed in ${durationSeconds}`);
    
    if (merkki !== undefined) {
      console.log(`[${timestampEnd}] ${this.modelName} detected brand: "${merkki}"`);
    }
    
    if (malli !== undefined) {
      console.log(`[${timestampEnd}] ${this.modelName} detected model: "${malli}"`);
    }
    
    return duration;
  }

  /**
   * Log an error that occurred during analysis
   * @param error The error that occurred
   */
  logError(error: unknown): void {
    const timestamp = new Date().toISOString();
    console.error(`[${timestamp}] Error in ${this.modelName} analysis:`, error);
  }
}