import { useState, useEffect, useCallback, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { ListGroup } from "react-bootstrap";
import Loading from "../Components/Loading";
import { byLastName } from "../services/sorts";
import FormComponent from "./NewAlumnForm";
import { AdminContext } from "../Context/Context";

function AddAlumns({
    onAlumnsChange,
    openAlumnShow,
    removeAlumnId,
    confirmRemovedAlumn,
}) {
    const baseUrl = process.env.REACT_APP_BASE_URL;

    const admin = useContext(AdminContext);

    const [alumns, setAlumns] = useState([]);
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const memoizedAlumnFetch = useCallback(async () => {
        const token = localStorage.getItem("jwt");

        const options = {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        };

        try {
            const res = await fetch(
                `${baseUrl}/alumns/${admin.labId}/index`,
                options
            );
            if (!res.ok) {
                throw res;
            }
            const alumnsArray = await res.json();
            return setAlumns(alumnsArray);
        } catch (res) {
            console.error(res);
            navigate("/error");
        }
    }, [navigate, baseUrl, admin.labId]);

    useEffect(() => {
        if (!alumns.length && admin.labId !== "") {
            memoizedAlumnFetch();
        }

        onAlumnsChange(alumns.length);
    }, [alumns.length, memoizedAlumnFetch, admin, onAlumnsChange]);

    useEffect(() => {
        if (alumns.length) {
            setLoading(false);
        }
    }, [alumns.length]);

    useEffect(() => {
        if (removeAlumnId) {
            memoizedAlumnFetch().then(confirmRemovedAlumn);
        }
    }, [memoizedAlumnFetch, removeAlumnId, confirmRemovedAlumn]);

    const addAlumn = (alumnDisplayName) => {
        setLoading(true);
        const token = localStorage.getItem("jwt");

        let alumnObj = {
            alumn: {
                display_name: alumnDisplayName.toLowerCase(),
                lab_id: admin.labId,
            },
        };

        let options = {
            method: "POST",
            headers: {
                "content-type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(alumnObj),
        };

        fetch(`${baseUrl}/alumns`, options)
            .then((res) => {
                if (!res.ok) {
                    throw res;
                }
                return res.json();
            })
            .then((newAlumn) => {
                let newArray = [...alumns, newAlumn];
                setAlumns(newArray);
                openAlumnShow(newAlumn.alumn_lab_id);
            })
            .catch((err) => {
                console.error(err);
                navigate("/error");
            });
    };

    return (
        <div className="add-alumns mr-5 mb-4">
            <FormComponent submitInput={addAlumn} />
            {loading ? (
                <Loading />
            ) : (
                <div
                    style={{
                        display: "flex",
                        maxHeight: "700px",
                        overflow: "hidden",
                        overflowY: "scroll",
                    }}
                >
                    <ListGroup as="ul" style={{ width: "100%" }}>
                        {byLastName(alumns).map((alumn) => (
                            <ListGroup.Item
                                as="li"
                                key={alumn.alumn_lab_id}
                                onClick={() => openAlumnShow(alumn.alumn_lab_id)}
                                className=""
                            >
                                {alumn.search_names[1]}
                            </ListGroup.Item>
                        ))}
                    </ListGroup>
                </div>
            )}
        </div>
    );
}

export default AddAlumns;
