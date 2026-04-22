import { describe, it, expect } from 'vitest';
import { matchReply, CHATBOT_REPLIES } from '@/data/chatbotReplies';

describe('matchReply', () => {
  it('returns fallback when no keyword matches', () => {
    const result = matchReply('random query about weather');
    expect(result).toBeTruthy();
    expect(result.length).toBeGreaterThan(0);
  });

  it('matches a known keyword', () => {
    const r = matchReply('솔루션 알려주세요');
    expect(r).toBeTruthy();
  });

  it('has at least one reply configured', () => {
    expect(CHATBOT_REPLIES.length).toBeGreaterThan(0);
  });
});
