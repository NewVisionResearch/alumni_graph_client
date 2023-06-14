import { useState, useEffect } from "react";
import { Button } from "react-bootstrap";
import { byDate, byCoAuthors, sortByTwoFns } from "../services/sorts";
import PublicationDisplayCheck from "../Components/PublicationDisplayCheck";
import EditAlumnForm from "./EditAlumnForm";
import Loading from "../Components/Loading";

function AlumnShow({ alumnLabId, removeAlumn }) {
  const baseUrl = process.env.REACT_APP_BASE_URL;

  const [alumn, setAlumn] = useState({
    full_name: "",
    search_names: [],
    my_lab_alumn_publications: [],
  });
  const [idObj, setIdObj] = useState({});
  const [editSearchNames, setEditSearchNames] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (alumnLabId) {
      const fetchAlumn = () => {
        fetch(`${baseUrl}/alumns/${alumnLabId}`)
          .then((res) => res.json())
          .then((alumnObj) => setAlumn(alumnObj));
      };

      fetchAlumn();
      setEditSearchNames();
    }
  }, [alumnLabId, baseUrl]);

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
          alumn_lab_id: alumnLabId,
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
    fetch(`${baseUrl}/alumns/${alumnLabId}/refetch`, options)
      .then((res) => res.json())
      .then((alumnObj) => {
        setAlumn(alumnObj);
        setLoading(false);
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

    fetch(`${baseUrl}/alumns/${alumnLabId}`, options)
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
      Search names:
      <ol>
        {alumn.search_names.map((name, idx) => (
          <li key={`${name}_${alumnLabId}`}>{name}</li>
        ))}
      </ol>
      {editSearchNames ? (
        <EditAlumnForm
          submitInput={updateSearchNames}
          propsValue={[alumn.full_name, alumn.search_names]}
          closeModal={closeModal}
        />
      ) : (
        <Button onClick={() => setEditSearchNames(true)}>Edit Researcher</Button>
      )}
      <Button
        className={(editSearchNames && "mb-3") || (!editSearchNames && "ml-3")}
        variant="danger"
        onClick={(e) => removeAlumn(e, alumnLabId)}
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
                alumnName={alumn.search_names[0]}
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
