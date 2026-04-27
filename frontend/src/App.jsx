import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Users, BookOpen, PlusCircle, Trash2 } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

function App() {
  const [faculty, setFaculty] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form states
  const [newFaculty, setNewFaculty] = useState({ name: '', department: '', email: '' });
  const [newCourse, setNewCourse] = useState({ title: '', credits: '', faculty_id: '' });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [facRes, courRes] = await Promise.all([
        axios.get(`${API_URL}/faculty`),
        axios.get(`${API_URL}/courses`)
      ]);
      setFaculty(facRes.data);
      setCourses(courRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
      alert('Failed to fetch data. Is the backend running?');
    } finally {
      setLoading(false);
    }
  };

  const handleAddFaculty = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/faculty`, newFaculty);
      setNewFaculty({ name: '', department: '', email: '' });
      fetchData();
    } catch (error) {
      console.error('Error adding faculty:', error);
      alert('Failed to add faculty');
    }
  };

  const handleAddCourse = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/courses`, newCourse);
      setNewCourse({ title: '', credits: '', faculty_id: '' });
      fetchData();
    } catch (error) {
      console.error('Error adding course:', error);
      alert('Failed to add course');
    }
  };

  const handleDeleteFaculty = async (id) => {
    if (!window.confirm('Are you sure you want to delete this faculty member?')) return;
    try {
      await axios.delete(`${API_URL}/faculty/${id}`);
      fetchData();
    } catch (error) {
      console.error('Error deleting faculty:', error);
      alert('Failed to delete faculty');
    }
  };

  const handleDeleteCourse = async (id) => {
    if (!window.confirm('Are you sure you want to delete this course?')) return;
    try {
      await axios.delete(`${API_URL}/courses/${id}`);
      fetchData();
    } catch (error) {
      console.error('Error deleting course:', error);
      alert('Failed to delete course');
    }
  };

  if (loading) {
    return <div className="flex h-screen items-center justify-center text-xl text-gray-500">Loading data...</div>;
  }

  return (
    <div className="min-h-screen p-8 text-gray-800">
      <div className="max-w-6xl mx-auto space-y-8">

        <header className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
              Academic System
            </h1>
            <p className="text-gray-500 mt-1">Faculty Maintenance and Course Assignment</p>
          </div>
        </header>

        <div className="grid md:grid-cols-2 gap-8">

          {/* FACULTY SECTION */}
          <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
                <Users size={24} />
              </div>
              <h2 className="text-2xl font-semibold">Faculty Members</h2>
            </div>

            <form onSubmit={handleAddFaculty} className="mb-6 space-y-3 bg-gray-50 p-4 rounded-xl">
              <h3 className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <PlusCircle size={16} /> Add New Faculty
              </h3>
              <input required type="text" placeholder="Name" className="w-full p-2 rounded border focus:ring-2 focus:ring-blue-500 outline-none"
                value={newFaculty.name} onChange={e => setNewFaculty({ ...newFaculty, name: e.target.value })} />
              <div className="grid grid-cols-2 gap-3">
                <input required type="text" placeholder="Department" className="w-full p-2 rounded border focus:ring-2 focus:ring-blue-500 outline-none"
                  value={newFaculty.department} onChange={e => setNewFaculty({ ...newFaculty, department: e.target.value })} />
                <input required type="email" placeholder="Email" className="w-full p-2 rounded border focus:ring-2 focus:ring-blue-500 outline-none"
                  value={newFaculty.email} onChange={e => setNewFaculty({ ...newFaculty, email: e.target.value })} />
              </div>
              <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white p-2 rounded font-medium transition">
                Add Faculty
              </button>
            </form>

            <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
              {faculty.length === 0 ? <p className="text-gray-500 text-center py-4">No faculty found.</p> : null}
              {faculty.map(f => (
                <div key={f.id} className="p-4 border rounded-xl hover:shadow-md transition bg-white group flex justify-between items-start">
                  <div className="flex-1">
                    <h4 className="font-semibold text-lg">{f.name}</h4>
                    <div className="text-sm text-gray-500 flex justify-between mt-1">
                      <span>{f.department}</span>
                      <span className="opacity-0 group-hover:opacity-100 transition mr-4">{f.email}</span>
                    </div>
                  </div>
                  <button onClick={() => handleDeleteFaculty(f.id)} className="text-red-500 hover:text-red-700 p-2 opacity-0 group-hover:opacity-100 transition bg-red-50 hover:bg-red-100 rounded-lg" title="Delete Faculty">
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
            </div>
          </section>


          {/* COURSES SECTION */}
          <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-indigo-50 text-indigo-600 rounded-lg">
                <BookOpen size={24} />
              </div>
              <h2 className="text-2xl font-semibold">Courses</h2>
            </div>

            <form onSubmit={handleAddCourse} className="mb-6 space-y-3 bg-gray-50 p-4 rounded-xl">
              <h3 className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <PlusCircle size={16} /> Assign New Course
              </h3>
              <input required type="text" placeholder="Course Title" className="w-full p-2 rounded border focus:ring-2 focus:ring-indigo-500 outline-none"
                value={newCourse.title} onChange={e => setNewCourse({ ...newCourse, title: e.target.value })} />

              <div className="grid grid-cols-2 gap-3">
                <input required type="number" placeholder="Credits" min="1" max="6" className="w-full p-2 rounded border focus:ring-2 focus:ring-indigo-500 outline-none"
                  value={newCourse.credits} onChange={e => setNewCourse({ ...newCourse, credits: e.target.value })} />

                <select required className="w-full p-2 rounded border bg-white focus:ring-2 focus:ring-indigo-500 outline-none"
                  value={newCourse.faculty_id} onChange={e => setNewCourse({ ...newCourse, faculty_id: e.target.value })}>
                  <option value="" disabled>Select Faculty</option>
                  {faculty.map(f => (
                    <option key={f.id} value={f.id}>{f.name}</option>
                  ))}
                </select>
              </div>

              <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white p-2 rounded font-medium transition">
                Assign Course
              </button>
            </form>

            <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
              {courses.length === 0 ? <p className="text-gray-500 text-center py-4">No courses found.</p> : null}
              {courses.map(c => (
                <div key={c.id} className="p-4 border border-indigo-100 rounded-xl hover:shadow-md transition bg-indigo-50/30 group flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <h4 className="font-semibold text-lg text-indigo-900">{c.title}</h4>
                      <span className="bg-indigo-100 text-indigo-800 text-xs px-2 py-1 rounded-full font-medium mr-4">
                        {c.credits} Credits
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mt-2 flex items-center gap-2">
                      <Users size={14} className="text-gray-400" />
                      Assigned to: <span className="font-medium text-gray-800">{c.faculty_name || 'Unassigned'}</span>
                    </p>
                  </div>
                  <button onClick={() => handleDeleteCourse(c.id)} className="text-red-500 hover:text-red-700 p-2 opacity-0 group-hover:opacity-100 transition bg-red-50 hover:bg-red-100 rounded-lg" title="Delete Course">
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}

export default App;
