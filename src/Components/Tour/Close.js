import { components, useTour } from "@reactour/tour";

function Close(props) {
    const { steps, currentStep } = useTour();

    const currentSelector = steps[currentStep].selector;

    if (
        currentSelector === '[data-tour="query-results-modal"]' ||
        currentSelector === '[data-tour="add-researcher-modal"]'
    ) {
        return null;
    }

    return <components.Close onClick={props.onClick}>X</components.Close>;
}

export default Close;
