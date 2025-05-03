export async function getDailyVerse(version = 'NIV') {
  const res = await fetch(`https://bible-api.com/john%203:16?translation=${version}`);
  const data = await res.json();
  return {
    text: data.text,
    reference: data.reference,
    version: data.translation_name
  };
}
