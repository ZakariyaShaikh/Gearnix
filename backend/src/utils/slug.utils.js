export const slugify = (text) => {
    return text
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, '-')   // anything that isn't a letter/number becomes "-"
        .replace(/^-+|-+$/g, '');      // remove leading/trailing "-"
};