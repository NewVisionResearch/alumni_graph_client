import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { TourProvider } from "@reactour/tour";
import { disableBodyScroll, enableBodyScroll } from "body-scroll-lock";

import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { ADD_RESEARCHER_INITIAL_STEPS } from "./Constants/TourSteps";
import Badge from "./Components/Tour/Badge";
import Navigation from "./Components/Tour/Navigation";
import Close from "./Components/Tour/Close";

const container = document.getElementById("root");
const root = createRoot(container);

root.render(
    <React.StrictMode>
        <BrowserRouter>
            <TourProvider
                steps={ADD_RESEARCHER_INITIAL_STEPS}
                afterOpen={disableBodyScroll}
                beforeClose={enableBodyScroll}
                components={{ Badge, Navigation, Close }}
                scrollSmooth={true}
            >
                <App />
            </TourProvider>
        </BrowserRouter>
    </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
