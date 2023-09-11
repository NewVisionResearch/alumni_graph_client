import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Modal, Button, Spinner } from "react-bootstrap";

import AlumnShowComponent from "../Components/AlumnShowComponent";
import Loading from "../Components/Loading";
import {
  fetchAlumnById,
  patchLabPublication,
  patchLabAlumnPublication,
  refetchAlumnPublications,
  pollJobStatus,
  updateSearchNamesForAlumn,
} from "../services/api";

import "../styles/AlumnShow.css";
import { useContext } from "react";
import { ToastContext } from "../Context/ToastContext";

function AlumnShowContainer({
  alumnShowIdAndName,
  handleDeleteAlumn,
  addAlumnLoading,
}) {
  const showToast = useContext(ToastContext);

  const [alumn, setAlumn] = useState({
    full_name: "",
    search_query: "",
    my_lab_alumn_publications: [],
  });
  const [idObj, setIdObj] = useState({});
  const [editSearchNames, setEditSearchNames] = useState(false);
  const [editingReseracherError, setEditingReseracherError] = useState([]);
  const [showConfirmDeleteModal, setShowConfirmDeleteModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    if (alumnShowIdAndName) {
      setLoading(true);

      setAlumn(
        (prev) => (prev = { ...prev, full_name: alumnShowIdAndName.full_name })
      );

      const controller = new AbortController();
      const signal = controller.signal;

      fetchAlumnById(alumnShowIdAndName.alumn_id, signal)
        .then((res) => {
          if (!res.ok) throw res;

          return res.json();
        })
        .then((alumnObj) => {
          setAlumn(alumnObj);
          setLoading(false);
        })
        .catch((err) => {
          if (err.name !== "AbortError") {
            console.error(err);
            setLoading(false);
          }
        });

      setEditSearchNames(false);

      return () => {
        controller.abort();
      };
    }
  }, [alumnShowIdAndName]);

  const invalidatePublication = async (labPublicationId) => {
    let bodyObj = {
      lab_publication: {
        display: false,
      },
    };

    try {
      const res = await patchLabPublication(labPublicationId, bodyObj);
      if (!res.ok) throw res;

      const publicationId = await res.json();
      let newArray = alumn.my_lab_alumn_publications.filter(
        (ap) => ap.publication.id !== publicationId
      );

      setAlumn({ ...alumn, my_lab_alumn_publications: newArray });
    } catch (err) {
      console.error(err);
    }
  };

  const updateIdArray = (id, display) => {
    let newIdObj = { ...idObj };
    newIdObj[id] = display;
    setIdObj(newIdObj);
  };

  const updateDatabase = async () => {
    for (const id in idObj) {
      let bodyObj = {
        lab_alumn_publication: {
          alumn_id: alumnShowIdAndName.alumn_id,
          alumn_publication_id: id,
          display: idObj[id],
        },
      };

      try {
        const res = await patchLabAlumnPublication(bodyObj);

        if (!res.ok) throw res;

        setIdObj({});
      } catch (err) {
        console.error(err);
      }
    }
  };

  const refetchPublications = async () => {
    setLoading(true);

    try {
      const res = await refetchAlumnPublications(alumnShowIdAndName.alumn_id);

      if (!res.ok) throw res;

      const { job_id } = await res.json();

      const pollJobStatusInterval = setInterval(async () => {
        const pollRes = await pollJobStatus(job_id);

        if (!pollRes.ok) throw new Error("Job status request failed");

        const response = await pollRes.json();

        if (response.job.status === "completed") {
          clearInterval(pollJobStatusInterval);
          setAlumn({
            alumn_id: response.alumn_id,
            full_name: response.full_name,
            search_query: response.search_query,
            my_lab_alumn_publications: response.my_lab_alumn_publications,
          });
          setLoading(false);
        } else if (response.job.status === "failed") {
          clearInterval(pollJobStatusInterval);
          throw new Error("Job Failed", response.error);
        }
      }, 5000);
    } catch (err) {
      console.error(err);
      navigate("/error");
    }
  };

  const updateSearchNames = async (alumnInfo) => {
    let bodyObj = {
      alumn: {
        ...alumnInfo,
        display_name: alumnInfo.display_name.toLowerCase().trim(),
      },
    };

    try {
      setEditingReseracherError("");

      const res = await updateSearchNamesForAlumn(
        alumnShowIdAndName.alumn_id,
        bodyObj
      );

      if (!res.ok) throw res;

      const alumnObj = await res.json();

      setAlumn(alumnObj);
      setEditSearchNames(false);
    } catch (err) {
      const error = await err.json();
      setEditingReseracherError(error.error);
    }
  };

  const handleRemoveAlumn = () => {
    setShowConfirmDeleteModal(true);
  };

  const closeForm = () => {
    setEditSearchNames(false);
    setEditingReseracherError("");
  };

  const handleAlumnDeletion = async (alumnId) => {
    setIsDeleting(true);

    try {
      await handleDeleteAlumn(alumnId);
      showToast({ header: "Delete Success!", body: "The researcher has been deleted." });
    } catch (err) {
      const error = await err.json();
      console.error(error);
      showToast({ header: "Delete Error", body: "Please try again later or contact the administrator." });
    } finally {
      setIsDeleting(false);
      setShowConfirmDeleteModal(false);
    }
  };

  return (
    <div className="alumn-show">
      {addAlumnLoading ? (
        <Loading />
      ) : alumnShowIdAndName ? (
        <>
          <AlumnShowComponent
            alumn={alumn}
            editSearchNames={editSearchNames}
            setEditSearchNames={setEditSearchNames}
            handleRemoveAlumn={handleRemoveAlumn}
            invalidatePublication={invalidatePublication}
            updateIdArray={updateIdArray}
            loading={loading}
            updateDatabase={updateDatabase}
            refetchPublications={refetchPublications}
            updateSearchNames={updateSearchNames}
            editingReseracherError={editingReseracherError}
            idObj={idObj}
            closeForm={closeForm}
          />

          <Modal
            show={showConfirmDeleteModal}
            onHide={() => setShowConfirmDeleteModal(false)}
          >
            <Modal.Header closeButton>
              <Modal.Title>Delete {alumnShowIdAndName.full_name}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              Are you sure you want to delete this researcher? This action
              cannot be undone, and you would need to re-add the researcher if
              necessary.
            </Modal.Body>
            <Modal.Footer className="mr-auto">
              <Button
                className="delete-button"
                type="button"
                disabled={isDeleting}
                onClick={() => handleAlumnDeletion(alumnShowIdAndName.alumn_id)}
              >
                {isDeleting ? (
                  <>
                    <Spinner
                      as="span"
                      animation="border"
                      size="sm"
                      role="status"
                      aria-hidden="true"
                    />
                    {" Deleting..."}
                  </>
                ) : (
                  "Delete"
                )}
              </Button>
              <Button
                className="cancel-button"
                type="button"
                disabled={isDeleting}
                onClick={() => setShowConfirmDeleteModal(false)}
              >
                Cancel
              </Button>
            </Modal.Footer>
          </Modal>
        </>
      ) : (
        <h1 className="text-center m-2">Select a researcher to view here</h1>
      )}
    </div>
  );
}

export default AlumnShowContainer;
