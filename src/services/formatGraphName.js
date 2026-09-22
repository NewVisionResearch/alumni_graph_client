// Presentation only: graph identifiers and saved researcher names stay unchanged.
export function formatGraphName(name) {
    return name.trim().replace(/\S+/gu, (part) => {
        // Preserve deliberately capitalized name parts such as McDonald.
        if (part !== part.toLowerCase()) return part;
        return part.replace(/(^|[-'’.])(\p{L})/gu, (_, prefix, letter) =>
            prefix + letter.toUpperCase()
        );
    });
}
