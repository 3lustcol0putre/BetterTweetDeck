const keywords = ['cw', 'tw', 'cn', 'content warning', 'trigger warning', 'content note'].join('|');
const makeRegexSource = (opener: string, closer: string) =>
  `^([\\${opener}]?\\b(?:${keywords})\\b(?:\\W+)?\\s?([^\\n|\\${closer}|…]+)[\\${closer}…]?)(?:\\s\\n+)?((?:.+)?\\n?)+$`;
const contentWarningRegexWithBrackets = new RegExp(
  `(?:${makeRegexSource('[', ']')}|${makeRegexSource('(', ')')})`,
  'i'
);

const withoutKeywordRegex = new RegExp(
  `^([\\[]([^\\n|\\[\\]|…]+)[\\]\\)…])(?:\\n+)?((?:.+)?\\n?)+$`,
  'i'
);

export interface ContentWarningResult {
  block: string;
  subject: string;
  text: string;
  shouldRemoveSubject: boolean;
}

export function extractContentWarnings(
  input: string,
  /** Comma separated keywords */
  allowedKeywords: string
): ContentWarningResult | undefined {
  const keywords = allowedKeywords.split(',').map((w) => w.trim().toLowerCase());
  const contentWarningMatch =
    input.match(contentWarningRegexWithBrackets) || input.match(withoutKeywordRegex);
  const isWithoutKeyword =
    !input.match(contentWarningRegexWithBrackets) && input.match(withoutKeywordRegex);
  if (!contentWarningMatch) {
    return undefined;
  }

  let block = contentWarningMatch[1].trim();
  let subject = contentWarningMatch[2].trim();
  let text = contentWarningMatch[3].trim();

  if (block.includes(subject) && !text) {
    const [newSubject, ...newText] = subject.split('. ');
    block = block.replace(newText.join('. '), '').trim();
    subject = (newSubject + '.').trim();
    text = newText.join('. ').trim();
  }

  if (isWithoutKeyword) {
    const subjects = subject.split(',').map((w) => w.toLowerCase());
    // If the keyword(s) we detected are NOT in the list of allowed keywords then we don't match
    if (
      !keywords.some((allowedKeyword) => {
        return subjects.includes(allowedKeyword);
      })
    ) {
      return undefined;
    }
  }

  return {
    block,
    subject,
    text,
    shouldRemoveSubject: true,
  };
}
