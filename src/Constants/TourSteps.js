export const ADD_RESEARCHER_INITIAL_STEPS = [
    {
        selector: '[data-tour="dashboard-tour"]',
        content: () => (
            <div>
                <h1 className="text-center">Welcome to the Dashboard!</h1>
                <p>
                    If it's your first time here or you're just brushing up,
                    let's walk through together. 😊
                </p>
            </div>
        ),
        position: "center",
    },
    {
        selector: '[data-tour="add-alumns-header-tour"]',
        content: () => (
            <div>
                <p>
                    Meet the <b>Add Researcher</b> section. Here, you can input
                    a researcher's name or modify an existing query.
                </p>
            </div>
        ),
        padding: { mask: [10, 10, 0, 10] },
    },
    {
        selector: '[data-tour="add-input-input-group"]',
        content: () => (
            <div>
                <p>
                    Enter the researcher's name here and click <b>Add</b>. It'll
                    then appear in the query box below.
                </p>
            </div>
        ),
        padding: { mask: [10, 10, 5, 10] },
    },
    {
        selector: '[data-tour="query-input-input-group"]',
        content: () => (
            <div>
                <p>
                    Want to tweak the query? Do it here! Alternatively, return
                    to the previous step to add another variation of the
                    researcher's name.
                    <br />
                    Once you're set, hit <b>Search</b> to see how many results
                    PubMed pulls up.
                </p>
            </div>
        ),
        padding: { mask: [5, 10, 10, 10] },
    },
];

export const QUERY_RESULTS_MODAL_STEPS = [
    {
        selector: '[data-tour="query-results-modal"]',
        content: () => (
            <div>
                <p>
                    These are your search results. Feel free to either{" "}
                    <b>Cancel</b> or <b>Continue</b> with the researcher
                    addition.
                </p>
            </div>
        ),
    },
];

export const ADD_RESEARCHER_MODAL_STEPS = [
    {
        selector: '[data-tour="add-researcher-modal"]',
        content: () => (
            <div>
                <p>
                    Now, select a display name for the researcher. When you're
                    satisfied, hit <b>Save</b> to include this researcher in
                    your list.
                </p>
            </div>
        ),
    },
];

export const ALUMN_SHOW_STEPS = [
    {
        selector: ".alumn-show",
        content: () => (
            <div>
                <p>
                    After adding a researcher, they'll appear here. Note: It
                    might take some time for their publications to load.
                </p>
            </div>
        ),
    },
];

export const ALUMNS_LIST_STEPS = [
    {
        selector: ".alumns-list",
        content: () => (
            <div>
                <p>
                    This is your list of added researchers. You can search
                    through this list or simply click on a researcher's name to
                    view their details on the right.
                </p>
            </div>
        ),
    },
];
