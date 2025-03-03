/**
 * Bowling Game Implementation
 * As per the Bowling Kata requirements
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