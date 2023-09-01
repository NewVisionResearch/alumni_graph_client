import { useCallback, useState, useEffect, useContext, useRef } from "react";
import { useNavigate } from "react-router-dom";

import DashboardComponent from "../Components/DashboardComponent";
import { deleteAlumn } from "../services/api";
import { AdminContext } from "../Context/Context";

function DashboardContainer() {
  const [alumns, setAlumns] = useState([]);
  const [alumnShowId, setAlumnShowId] = useState(null);
  const [removeAlumnId, setRemoveAlumnId] = useState(null);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [addAlumnLoading, setAddAlumnLoading] = useState(false);

  const baseUrl = process.env.REACT_APP_BASE_URL;

  const admin = useContext(AdminContext);

  const navigate = useRef(useNavigate());

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
      console.error("Network response was not ok");
    }
  };

  const handleInfoClick = () => {
    setShowInfoModal((prev) => !prev);
  };

  const confirmRemovedAlumn = useCallback(() => {
    setRemoveAlumnId(null);
  }, []);

  const handleAlumnsChange = useCallback((alumnsLength) => {
    if (alumnsLength > 0) {
      setShowInfoModal(false);
    } else if (alumnsLength === 0) {
      setShowInfoModal(true);
    }
  }, []);

  // useEffect(() => {
  //   if (alumns.length) {
  //     setLoading(false);
  //   }
  // }, [alumns.length]);

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
      navigate.current("/error");
    }
  }, [admin.labId, baseUrl]);

  // fetch alumns when alumns or admin changes
  useEffect(() => {
    if (!alumns.length && admin.labId !== "") {
      memoizedAlumnFetch();
    }

    handleAlumnsChange(alumns.length);
  }, [alumns.length, admin, memoizedAlumnFetch, handleAlumnsChange]);

  // fetch alumns when alumn removed
  useEffect(() => {
    if (removeAlumnId) {
      memoizedAlumnFetch().then(confirmRemovedAlumn);
    }
  }, [memoizedAlumnFetch, removeAlumnId, confirmRemovedAlumn]);

  return (
    <DashboardComponent
      showInfoModal={showInfoModal}
      setShowInfoModal={setShowInfoModal}
      openAlumnShow={openAlumnShow}
      handleInfoClick={handleInfoClick}
      handleDeleteAlumn={handleDeleteAlumn}
      loading={loading}
      setLoading={setLoading}
      addAlumnLoading={addAlumnLoading}
      setAddAlumnLoading={setAddAlumnLoading}
      alumns={alumns}
      setAlumns={setAlumns}
      alumnShowId={alumnShowId}
    />
  );
}

export default DashboardContainer;
