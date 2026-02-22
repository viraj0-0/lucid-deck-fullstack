import React from 'react'
import { Route, Routes, Navigate} from 'react-router-dom';
import Codeide from "./pages/Codeide"
import Home from './pages/Home'
import Admission from './pages/Admission';
import Msbtemcq from './pages/Msbtemcq';
import NotFound from './pages/NotFound'
import Whiteboard from './pages/Whiteboard';
import StudyHub from './pages/StudyHub';
import NexusDocs from './pages/NexusDocs';
export default function App() {
  return (
    <>
    <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/code" element={<Codeide />} />
        <Route path="/admission" element={<Admission />} />
        <Route path="/mcq" element={<Msbtemcq />} />
        <Route path="/nexusdocs" element={<NexusDocs />} />
        <Route path="/StudyHub" element={<StudyHub />} />
        <Route path="/whiteboard" element={<Whiteboard />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  )
}
