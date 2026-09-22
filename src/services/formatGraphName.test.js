import { formatGraphName } from "./formatGraphName";

test.each([
    ["joseph m. castellano", "Joseph M. Castellano"],
    ["j.r. turner", "J.R. Turner"],
    ["anne-marie o’neill", "Anne-Marie O’Neill"],
    ["élise o'connor", "Élise O'Connor"],
    ["  Rebecca A. McDonald  ", "Rebecca A. McDonald"],
    ["", ""],
])("formats %s for graph display", (name, expected) => {
    expect(formatGraphName(name)).toBe(expected);
});
