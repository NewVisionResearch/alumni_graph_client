import { useCallback, useState } from "react";

import DashboardComponent from "../Components/DashboardComponent";
import AlumnShowContainer from "./AlumnShowContainer";
import { deleteAlumn } from "../services/api";

function DashboardContainer() {
  const [alumnShowId, setAlumnShowId] = useState(null);
  const [removeAlumnId, setRemoveAlumnId] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const openAlumnShow = (alumn_id) => {
    setAlumnShowId(alumn_id);
  };

  const handleDeleteAlumn = async (alumn_id) => {
    try {
      const token = localStorage.getItem("jwt");
      const res = await deleteAlumn(alumn_id, token);

      if (!res.ok) throw res;

      setRemoveAlumnId(alumn_id);
      setAlumnShowId(null);
    } catch (error) {
      console.eror("Network response was not ok");

    }
  };

  const confirmRemovedAlumn = () => {
    setRemoveAlumnId(null);
  };

  const handleInfoClick = () => {
    setShowModal((prev) => !prev);
  };

  const handleAlumnsChange = useCallback((alumnsLength) => {
    if (alumnsLength > 0) {
      setShowModal(false);
    } else if (alumnsLength === 0) {
      setShowModal(true);
    }
  }, []);

  return (
    <div>

      <DashboardComponent
        showModal={showModal}
        setShowModal={setShowModal}
        openAlumnShow={openAlumnShow}
        removeAlumnId={removeAlumnId}
        confirmRemovedAlumn={confirmRemovedAlumn}
        handleAlumnsChange={handleAlumnsChange}
        handleDeleteAlumn={handleDeleteAlumn}
        handleInfoClick={handleInfoClick}
      />
      {
        alumnShowId && (
          <AlumnShowContainer alumnId={alumnShowId} handleDeleteAlumn={handleDeleteAlumn} />
        )
      }
    </div>
  );
}

export default DashboardContainer;
