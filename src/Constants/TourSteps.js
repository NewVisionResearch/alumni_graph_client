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
        position: "left",
    },
    {
        selector: "[data-tour='alumn-show-edit-button-tour']",
        content: () => (
            <div>
                <p>
                    This section displays the selected researcher's details,
                    including the search query that was used to find their
                    publications. You have the option to <b>Edit Researcher</b>{" "}
                    to refine the search query, or <b>Delete Researcher</b> if
                    you wish to remove their profile from your list.
                </p>
            </div>
        ),
        position: "left",
    },
    {
        selector: "[data-tour='publications-count-tour']",
        content: () => (
            <div>
                <p>
                    This figure represents the number of publications currently
                    linked to the researcher in your dashboard.
                </p>
            </div>
        ),
        position: "left",
    },
    {
        selector: ".alumn-show-list",
        content: () => (
            <div>
                <p>
                    This list shows the researcher's publications. Uncheck a
                    publication to hide it from the graph. Click <b>Delete</b>{" "}
                    to permanently remove it from this profile. To retrieve it
                    again, you'll need to use the <b>Fetch New Publications</b>{" "}
                    feature.
                </p>
            </div>
        ),
        position: "left",
    },
    {
        selector: "[data-tour='alumn-show-buttons-tour']",
        content: () => (
            <div>
                <p>
                    Click <b>Update Publications</b> to apply changes after
                    checking or unchecking publications. This will adjust which
                    publications are displayed for this researcher in the graph.
                </p>
                <p>
                    Click <b>Fetch New Publications</b> to retrieve the most
                    recent publications based on the researcher's search query.
                    This is useful for adding new publications or refreshing the
                    current list.
                </p>
            </div>
        ),
        position: "left",
    },
];

export const EDITING_RESEARCHER_STEPS = [
    {
        selector: "[data-tour='edit-researcher-form-tour']",
        content: () => (
            <div>
                <p>
                    This form allows you to update the information for the
                    selected researcher. You can modify their display name or
                    the search query used to fetch their publications.
                </p>
            </div>
        ),
        position: "left",
    },
    {
        selector: "[data-tour='edit-researcher-display-name-tour']",
        content: () => (
            <div>
                <p>
                    In this field, you can edit the researcher's display name.
                    This name will be used on the collaboration graph and
                    throughout the dashboard. Make sure it's accurate and
                    recognizable.
                </p>
            </div>
        ),
    },
    {
        selector: "[data-tour='edit-researcher-search-query-tour']",
        content: () => (
            <div>
                <p>
                    Here you can refine the search query for the researcher's
                    publications. Adjusting this query can help in accurately
                    fetching the researcher's body of work from PubMed.
                </p>
            </div>
        ),
        position: "top",
    },
    {
        selector: "[data-tour='edit-researcher-button-tour']",
        content: () => (
            <div>
                <p>
                    Once you've finished editing, you can choose to{" "}
                    <b>Cancel</b> to discard any changes, or <b>Save</b> to
                    apply them. Remember, hitting <b>Save</b> will update the
                    information for this researcher across the dashboard.
                </p>
            </div>
        ),
    },
];
