/**
 * Bowling Game Implementation
 * Following TDD approach as per the Bowling Kata
 */

class BowlingGame {
    constructor() {
      this.rolls = [];
    }
  
    roll(pins) {
      this.rolls.push(pins);
    }
  
    score() {
      let score = 0;
      let rollIndex = 0;
  
      for (let frame = 0; frame < 10; frame++) {
        if (this.isStrike(rollIndex)) {
          // Strike
          score += this.strikeScore(rollIndex);
          rollIndex += 1;
        } else if (this.isSpare(rollIndex)) {
          // Spare
          score += this.spareScore(rollIndex);
          rollIndex += 2;
        } else {
          // Regular frame
          score += this.frameScore(rollIndex);
          rollIndex += 2;
        }
      }
  
      return score;
    }
  
    isStrike(rollIndex) {
      return this.rolls[rollIndex] === 10;
    }
  
    isSpare(rollIndex) {
      return this.rolls[rollIndex] + this.rolls[rollIndex + 1] === 10;
    }
  
    strikeScore(rollIndex) {
      return 10 + this.rolls[rollIndex + 1] + this.rolls[rollIndex + 2];
    }
  
    spareScore(rollIndex) {
      return 10 + this.rolls[rollIndex + 2];
    }
  
    frameScore(rollIndex) {
      return this.rolls[rollIndex] + this.rolls[rollIndex + 1];
    }
  }
  
  /**
   * Test Suite for BowlingGame
   * This would normally be in a separate file, but included here for completeness
   */
  class BowlingGameTest {
    static runTests() {
      this.testGutterGame();
      this.testAllOnes();
      this.testOneSpare();
      this.testOneStrike();
      this.testPerfectGame();
      this.testAllNinesAndMisses();
      this.testAllSpares();
      console.log('All tests passed!');
    }
  
    static testGutterGame() {
      const game = new BowlingGame();
      for (let i = 0; i < 20; i++) {
        game.roll(0);
      }
      this.assertEqual(game.score(), 0, 'Gutter game should score 0');
    }
  
    static testAllOnes() {
      const game = new BowlingGame();
      for (let i = 0; i < 20; i++) {
        game.roll(1);
      }
      this.assertEqual(game.score(), 20, 'All ones should score 20');
    }
  
    static testOneSpare() {
      const game = new BowlingGame();
      game.roll(5);
      game.roll(5); // spare
      game.roll(3);
      // Fill the rest with zeros
      for (let i = 0; i < 17; i++) {
        game.roll(0);
      }
      this.assertEqual(game.score(), 16, 'One spare should score 16');
    }
  
    static testOneStrike() {
      const game = new BowlingGame();
      game.roll(10); // strike
      game.roll(3);
      game.roll(4);
      // Fill the rest with zeros
      for (let i = 0; i < 16; i++) {
        game.roll(0);
      }
      this.assertEqual(game.score(), 24, 'One strike should score 24');
    }
  
    static testPerfectGame() {
      const game = new BowlingGame();
      for (let i = 0; i < 12; i++) {
        game.roll(10);
      }
      this.assertEqual(game.score(), 300, 'Perfect game should score 300');
    }
  
    static testAllNinesAndMisses() {
      const game = new BowlingGame();
      for (let i = 0; i < 10; i++) {
        game.roll(9);
        game.roll(0);
      }
      this.assertEqual(game.score(), 90, 'All nines and misses should score 90');
    }
  
    static testAllSpares() {
      const game = new BowlingGame();
      for (let i = 0; i < 10; i++) {
        game.roll(5);
        game.roll(5);
      }
      game.roll(5); // Bonus roll for the last spare
      this.assertEqual(game.score(), 150, 'All spares with 5 pins should score 150');
    }
  
    static assertEqual(actual, expected, message) {
      if (actual !== expected) {
        throw new Error(`${message}: Expected ${expected}, got ${actual}`);
      }
    }
  }
  
  // Run tests if this is being executed directly
  if (typeof window === 'undefined') {
    BowlingGameTest.runTests();
  }