import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import AlumnShowComponent from "../Components/AlumnShowComponent";
import {
  fetchAlumnById,
  patchLabPublication,
  patchLabAlumnPublication,
  refetchAlumnPublications,
  pollJobStatus,
  updateSearchNamesForAlumn,
} from "../services/api";

function AlumnShowContainer({
  alumnId,
  handleDeleteAlumn,
  loading,
  setLoading,
}) {
  const [alumn, setAlumn] = useState({
    full_name: "",
    search_query: "",
    my_lab_alumn_publications: [],
  });
  const [idObj, setIdObj] = useState({});
  const [editSearchNames, setEditSearchNames] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    if (alumnId) {
      const controller = new AbortController();
      const signal = controller.signal;

      setLoading(true);

      fetchAlumnById(alumnId, signal)
        .then((res) => {
          if (!res.ok) throw res;

          return res.json();
        })
        .then((alumnObj) => {
          setAlumn(alumnObj);
          setLoading(false);
        })
        .catch((err) => {
          console.error(err);
          setLoading(false);
        });

      setEditSearchNames(false);

      return () => {
        controller.abort();
      };
    }
  }, [alumnId, setLoading]);

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
          alumn_id: alumnId,
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
      const res = await refetchAlumnPublications(alumnId);

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
        display_name: alumnInfo.display_name.toLowerCase(),
      },
    };

    const res = await updateSearchNamesForAlumn(alumnId, bodyObj);

    if (!res.ok) throw res;

    const alumnObj = await res.json();

    setAlumn(alumnObj);
    setEditSearchNames(false);
  };

  const handleRemoveAlumn = () => {
    handleDeleteAlumn(alumnId);
  };

  return (
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
    />
  );
}

export default AlumnShowContainer;
