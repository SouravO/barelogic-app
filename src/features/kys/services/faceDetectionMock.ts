/**
 * Mock face detection service for UI development and testing
 * Simulates realistic face detection and head pose changes over time
 */

import type { FaceDetectionResult, FaceDetectionService, TargetPose } from '../types/selfie-capture.types';

interface MockDetectionConfig {
  /** Frames per second for detection simulation */
  fps: number;
  /** Whether to auto-cycle through poses */
  autoCycle: boolean;
  /** Duration each pose is held (milliseconds) */
  poseDuration: number;
}

export class MockFaceDetector implements FaceDetectionService {
  private intervalId: NodeJS.Timeout | null = null;
  private callback: ((result: FaceDetectionResult) => void) | null = null;
  private frameCount = 0;
  private currentCycleTime = 0;
  private forcedPose: TargetPose | null = null;
  public isActive = false;

  private config: MockDetectionConfig = {
    fps: 30,
    autoCycle: true,
    poseDuration: 3000, // Hold each pose for 3 seconds
  };

  constructor(config?: Partial<MockDetectionConfig>) {
    if (config) {
      this.config = { ...this.config, ...config };
    }
  }

  /**
   * Start mock face detection
   */
  startDetection(onDetected: (result: FaceDetectionResult) => void): void {
    if (this.isActive) {
      console.warn('MockFaceDetector: Detection already active');
      return;
    }

    this.callback = onDetected;
    this.isActive = true;
    this.frameCount = 0;
    this.currentCycleTime = 0;

    const frameInterval = 1000 / this.config.fps;

    // Simulate initial delay (face appears after 1-2 seconds)
    const initialDelay = 1000 + Math.random() * 1000;

    setTimeout(() => {
      if (!this.isActive) return;

      this.intervalId = setInterval(() => {
        this.processFrame();
      }, frameInterval);
    }, initialDelay);
  }

  /**
   * Stop detection and cleanup
   */
  stopDetection(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    this.isActive = false;
    this.callback = null;
    this.frameCount = 0;
    this.currentCycleTime = 0;
    this.forcedPose = null;
  }

  /**
   * Force a specific pose for testing
   * Useful for manual testing of specific scenarios
   */
  simulatePose(targetPose: TargetPose | null): void {
    this.forcedPose = targetPose;
    this.currentCycleTime = 0; // Reset cycle when forcing pose
  }

  /**
   * Simulate no face detected
   */
  simulateNoFace(duration: number = 3000): void {
    const wasActive = this.isActive;
    this.stopDetection();

    setTimeout(() => {
      if (wasActive && this.callback) {
        this.startDetection(this.callback);
      }
    }, duration);
  }

  /**
   * Process a single detection frame
   */
  private processFrame(): void {
    if (!this.callback || !this.isActive) return;

    this.frameCount++;
    this.currentCycleTime += 1000 / this.config.fps;

    const result = this.generateDetectionResult();
    this.callback(result);
  }

  /**
   * Generate realistic detection result based on current state
   */
  private generateDetectionResult(): FaceDetectionResult {
    // Occasionally simulate no face (e.g., user moves out of frame)
    if (Math.random() < 0.02) {
      // 2% chance per frame
      return {
        faceDetected: false,
        faceCount: 0,
      };
    }

    // Occasionally simulate multiple faces (e.g., someone walks by)
    if (Math.random() < 0.01) {
      // 1% chance per frame
      return {
        faceDetected: true,
        faceCount: 2,
        confidence: 0.85,
      };
    }

    // Normal single face detection
    const headPose = this.calculateHeadPose();
    
    return {
      faceDetected: true,
      faceCount: 1,
      bounds: this.generateFaceBounds(),
      headPose,
      confidence: 0.92 + Math.random() * 0.08, // 0.92-1.0
    };
  }

  /**
   * Calculate head pose based on auto-cycle or forced pose
   */
  private calculateHeadPose() {
    if (this.forcedPose) {
      return this.getPoseAngles(this.forcedPose);
    }

    if (!this.config.autoCycle) {
      // Default to front pose if not cycling
      return this.getPoseAngles('front');
    }

    // Auto-cycle through poses: front → left → right → front
    const cycleProgress = this.currentCycleTime % (this.config.poseDuration * 3);
    
    let targetPose: TargetPose;
    if (cycleProgress < this.config.poseDuration) {
      targetPose = 'front';
    } else if (cycleProgress < this.config.poseDuration * 2) {
      targetPose = 'left';
    } else {
      targetPose = 'right';
    }

    // Get base angles for target pose
    const baseAngles = this.getPoseAngles(targetPose);

    // Add small random variations to simulate natural movement
    const yawVariation = (Math.random() - 0.5) * 4; // ±2 degrees
    const pitchVariation = (Math.random() - 0.5) * 3; // ±1.5 degrees
    const rollVariation = (Math.random() - 0.5) * 2; // ±1 degree

    return {
      yaw: baseAngles.yaw + yawVariation,
      pitch: baseAngles.pitch + pitchVariation,
      roll: baseAngles.roll + rollVariation,
    };
  }

  /**
   * Get base angles for a specific pose
   */
  private getPoseAngles(pose: TargetPose) {
    switch (pose) {
      case 'front':
        return { yaw: 0, pitch: 0, roll: 0 };
      case 'left':
        // User turns left (right side of face visible to camera)
        return { yaw: 38, pitch: 0, roll: 0 };
      case 'right':
        // User turns right (left side of face visible to camera)
        return { yaw: -38, pitch: 0, roll: 0 };
    }
  }

  /**
   * Generate realistic face bounds (normalized 0-1)
   */
  private generateFaceBounds() {
    // Face typically centered with some natural movement
    const centerX = 0.5 + (Math.random() - 0.5) * 0.1; // 0.45-0.55
    const centerY = 0.45 + (Math.random() - 0.5) * 0.1; // 0.40-0.50
    const width = 0.35 + Math.random() * 0.1; // 0.35-0.45
    const height = 0.45 + Math.random() * 0.1; // 0.45-0.55

    return {
      x: centerX - width / 2,
      y: centerY - height / 2,
      width,
      height,
    };
  }

  /**
   * Get current mock state for debugging
   */
  getDebugInfo() {
    return {
      isActive: this.isActive,
      frameCount: this.frameCount,
      cycleTime: this.currentCycleTime,
      forcedPose: this.forcedPose,
      config: this.config,
    };
  }
}

/**
 * Create a mock face detector instance with optional config
 */
export function createMockDetector(config?: Partial<MockDetectionConfig>): MockFaceDetector {
  return new MockFaceDetector(config);
}
