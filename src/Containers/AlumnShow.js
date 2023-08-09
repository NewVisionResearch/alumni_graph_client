import { useState, useEffect } from "react";
import { Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { byDate, byCoAuthors, sortByTwoFns } from "../services/sorts";
import PublicationDisplayCheck from "../Components/PublicationDisplayCheck";
import EditAlumnForm from "./EditAlumnForm";
import Loading from "../Components/Loading";

function AlumnShow({ alumnId, removeAlumn }) {
  const baseUrl = process.env.REACT_APP_BASE_URL;

  const [alumn, setAlumn] = useState({
    full_name: "",
    search_query: "",
    my_lab_alumn_publications: [],
  });
  const [idObj, setIdObj] = useState({});
  const [editSearchNames, setEditSearchNames] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    if (alumnId) {
      const fetchAlumn = () => {
        fetch(`${baseUrl}/alumns/${alumnId}`)
          .then((res) => res.json())
          .then((alumnObj) => setAlumn(alumnObj));
      };

      fetchAlumn();
      setEditSearchNames();
    }
  }, [alumnId, baseUrl]);

  const invalidatePublication = (e, labPublicationId) => {
    let bodyObj = {
      lab_publication: {
        display: false,
      },
    };

    const options = {
      method: "PATCH",
      headers: {
        "content-type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(bodyObj),
    };

    fetch(`${baseUrl}/lab_publications/${labPublicationId}`, options)
      .then((res) => {
        if (!res.ok) {
          throw res;
        }
        return res.json();
      })
      .then((publicationId) => {
        let newArray = alumn.my_lab_alumn_publications.filter(
          (ap) => ap.publication.id !== publicationId
        );
        setAlumn({ ...alumn, my_lab_alumn_publications: newArray });
      })
      .catch((err) => console.error(err));
  };

  const updateIdArray = (id, display) => {
    let newIdObj = { ...idObj };
    newIdObj[id] = display;
    setIdObj(newIdObj);
  };

  const token = localStorage.getItem("jwt");
  const updateDatabase = () => {
    for (const id in idObj) {
      let bodyObj = {
        lab_alumn_publication: {
          alumn_id: alumnId,
          alumn_publication_id: id,
          display: idObj[id],
        },
      };

      const options = {
        method: "PATCH",
        headers: {
          "content-type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(bodyObj),
      };

      fetch(`${baseUrl}/lab_alumn_publications`, options);
    }
  };

  const refetchPublications = () => {
    setLoading(true);

    const options = {
      method: "GET",
      headers: {
        "content-type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    };
    fetch(`${baseUrl}/alumns/${alumnId}/refetch`, options)
      .then((res) => {
        if (!res.ok) {
          throw res;
        }
        return res.json();
      })
      .then((response) => {
        const { job_id } = response;

        const pollJobStatus = setInterval(() => {
          fetch(`${baseUrl}/jobs/${job_id}`, {
            headers: { Authorization: `Bearer ${token}` },
          })
            .then((res) => {
              if (!res.ok) {
                throw new Error("Job status request failed");
              }

              return res.json();
            })
            .then((res) => {
              if (res.job.status === "completed") {
                clearInterval(pollJobStatus);
                setAlumn({
                  alumn_id: res.alumn_id,
                  full_name: res.full_name,
                  search_query: res.search_query,
                  my_lab_alumn_publications: res.my_lab_alumn_publications
                });
                setLoading(false);
              } else if (res.job.status === "failed") {
                clearInterval(pollJobStatus);
                console.error("Job failed:", res.error);
                navigate("/error");
              }
            });
        }, 5000);
      });
  };

  const updateSearchNames = (alumnInfo) => {
    let bodyObj = {
      alumn: {
        ...alumnInfo,
        display_name: alumnInfo.display_name.toLowerCase(),
      },
    };

    const options = {
      method: "PATCH",
      headers: {
        "content-type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(bodyObj),
    };

    fetch(`${baseUrl}/alumns/${alumnId}`, options)
      .then((res) => res.json())
      .then((alumnObj) => setAlumn(alumnObj))
      .then(() => setEditSearchNames(false));
  };

  const filterValidPublications = () => {
    return alumn.my_lab_alumn_publications.filter(
      (ap) => ap.publication.display === true
    );
  };

  const closeModal = () => {
    setEditSearchNames(false);
  };

  return (
    <div className="ml-auto mr-auto" style={{ maxWidth: "60%" }}>
      <h1>{alumn.full_name}</h1>
      <p>Search Query: {alumn.search_query}</p>
      {editSearchNames ? (
        <EditAlumnForm
          submitInput={updateSearchNames}
          propsValue={[alumn.full_name, alumn.search_query]}
          closeModal={closeModal}
        />
      ) : (
        <Button onClick={() => setEditSearchNames(true)}>Edit Researcher</Button>
      )}
      <Button
        className={(editSearchNames && "mb-3") || (!editSearchNames && "ml-3")}
        variant="danger"
        onClick={(e) => removeAlumn(e, alumnId)}
      >
        Delete Researcher
      </Button>
      <p>Publications ({filterValidPublications().length || "Loading..."}):</p>
      {loading ? <Loading /> :
        <ul
          style={{ maxHeight: "500px", overflowY: "hidden", overflow: "scroll" }}
        >
          {sortByTwoFns(byDate, byCoAuthors, filterValidPublications()).map(
            (alumn_pub, idx) => (
              <PublicationDisplayCheck
                key={`${alumn_pub.lab_alumn_publication_id}_${idx}`}
                alumnName={alumn.search_query}
                alumn_publication={alumn_pub}
                updateIdArray={updateIdArray}
                invalidatePublication={invalidatePublication}
              />
            )
          )}
        </ul>
      }
      <Button className="mr-3" onClick={updateDatabase}>
        Update Publications
      </Button>
      <Button className="ml-3" onClick={refetchPublications}>
        Fetch New Publications
      </Button>
    </div>
  );
}

export default AlumnShow;
