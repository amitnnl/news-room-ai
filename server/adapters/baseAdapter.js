export class BasePlatformAdapter {
  constructor(platformName) {
    this.platformName = platformName;
  }

  async publish(contentPayload, credentials = {}) {
    throw new Error(`publish() not implemented for ${this.platformName}`);
  }

  async schedule(contentPayload, scheduledTime, credentials = {}) {
    throw new Error(`schedule() not implemented for ${this.platformName}`);
  }

  async update(postId, updatedPayload, credentials = {}) {
    throw new Error(`update() not implemented for ${this.platformName}`);
  }

  async delete(postId, credentials = {}) {
    throw new Error(`delete() not implemented for ${this.platformName}`);
  }

  async getStatus(postId, credentials = {}) {
    throw new Error(`getStatus() not implemented for ${this.platformName}`);
  }

  async getAnalytics(postId, credentials = {}) {
    throw new Error(`getAnalytics() not implemented for ${this.platformName}`);
  }
}
