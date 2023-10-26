import { components } from "@reactour/tour";

function Badge({ children }) {
    return (
        <components.Badge
            styles={{
                badge: (base) => ({
                    ...base,
                    backgroundColor: "var(--custom-purple)",
                }),
            }}
        >
            {children}
        </components.Badge>
    );
}

export default Badge;
