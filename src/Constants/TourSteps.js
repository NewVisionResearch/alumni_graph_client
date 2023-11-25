export const ADD_RESEARCHER_INITIAL_STEPS = [
    {
        selector: '[data-tour="dashboard-tour"]',
        content: () => (
            <div>
                <h1 className="text-center">Welcome to the Dashboard!</h1>
                <p>
                    This dashboard allows you to add and view researchers.
                    Researchers you add will appear in the collaboration graph,
                    showing their connections with other added researchers.
                    <br />
                    <br />
                    If you're new or need a reminder, follow this tour! 😊
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
                    This is the <b>Add Researcher</b> section. You can input a
                    researcher's name or directly adjust the search query.
                    Researchers you add will fetch publications from PubMed.
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
                    Start by entering a researcher's name. After hitting{" "}
                    <b>Add</b>, their details will populate the query box below.
                </p>
            </div>
        ),
        padding: { mask: [10, 10, 5, 10] },
        position: "top",
    },
    {
        selector: '[data-tour="query-input-input-group"]',
        content: () => (
            <div>
                <p>
                    Here, you can fine-tune your query. If you wish, go back and
                    add another variant of the researcher's name.
                    <br />
                    When you're ready, press <b>Search</b> to see the number of
                    matches from PubMed.
                </p>
            </div>
        ),
        padding: { mask: [5, 10, 10, 10] },
    },
];

export const ADD_RESEARCHER_DROPDOWN_MENU_STEPS = [
    {
        selector: '[data-tour="add-researcher-dropdown-menu"]',
        content: () => (
            <div>
                <h4>🔍 Refine Your Search</h4>
                <p>
                    Use the dropdown to combine search terms with boolean logic:
                </p>
                <ul>
                    <li>
                        <strong>AND</strong>: Both terms included.
                    </li>
                    <li>
                        <strong>OR</strong>: Either term included.
                    </li>
                    <li>
                        <strong>NOT</strong>: Exclude the term.
                    </li>
                </ul>
                <p>Combine to tailor your query!</p>
            </div>
        ),
        padding: { mask: [0, 0, 0, 0] },
    },
];

export const QUERY_RESULTS_MODAL_STEPS = [
    {
        selector: '[data-tour="query-results-modal"]',
        content: () => (
            <div>
                <p>
                    Behold, your search results from PubMed! From here, you can
                    either <b>Cancel</b> the operation or <b>Continue</b> to add
                    the researcher.
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
                    Now, it's time to choose a display name for this researcher.
                    It's recommended to use the researcher's full name for
                    clarity. This name will be displayed on the collaboration
                    graph.
                    <br />
                    <br />
                    When you're done, click <b>Save</b> to officially add this
                    researcher.
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
                    Start by exploring your directory of added researchers.
                    Click on any researcher in the list to view their detailed
                    profile and manage their publications.
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
                    After selecting a researcher, you'll be able to see their
                    full profile here. Manage their details or update their
                    publications as needed.
                </p>
            </div>
        ),
    },
];
