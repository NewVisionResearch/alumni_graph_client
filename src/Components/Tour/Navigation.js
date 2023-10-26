import { components } from "@reactour/tour";

function Navigation(props) {
    const customNavigationStyles = {
        ...props.styles,
        dot: (base, state) => ({
            ...base,
            backgroundColor: state.current
                ? "var(--custom-purple)"
                : "var(--custom-grey)",
        }),
    };

    return <components.Navigation {...props} styles={customNavigationStyles} />;
}

export default Navigation;
