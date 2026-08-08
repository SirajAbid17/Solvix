// components/Resume/CV-Generate/sections/AdditionalSections.jsx
import React from "react";
import {
  FaHeart,
  FaCog,
  FaAward,
  FaNewspaper,
  FaHands,
  FaUsers,
  FaLayerGroup,
  FaEdit,
  FaTrash,
  FaPlus,
  FaSave,
  FaTimes,
} from "react-icons/fa";

export default function AdditionalSections({
  dark,
  inputStyle,
  cardStyle,
  labelStyle,
  interests,
  setInterests,
  newInterest,
  setNewInterest,
  addInterest,
  removeInterest,
  handleInterestKeyPress,
  hobbies,
  setHobbies,
  newHobby,
  setNewHobby,
  addHobby,
  removeHobby,
  handleHobbyKeyPress,
  awards,
  setAwards,
  newAward,
  setNewAward,
  editingAwardIndex,
  setEditingAwardIndex,
  addAward,
  editAward,
  removeAward,
  cancelEditAward,
  publications,
  setPublications,
  newPublication,
  setNewPublication,
  editingPubIndex,
  setEditingPubIndex,
  addPublication,
  editPublication,
  removePublication,
  cancelEditPublication,
  volunteering,
  setVolunteering,
  newVolunteering,
  setNewVolunteering,
  editingVolIndex,
  setEditingVolIndex,
  addVolunteering,
  editVolunteering,
  removeVolunteering,
  cancelEditVolunteering,
  references,
  setReferences,
  newReference,
  setNewReference,
  editingRefIndex,
  setEditingRefIndex,
  addReference,
  editReference,
  removeReference,
  cancelEditReference,
  customSections,
  setCustomSections,
  newCustomSection,
  setNewCustomSection,
  editingCustomIndex,
  setEditingCustomIndex,
  addCustomSection,
  editCustomSection,
  removeCustomSection,
  cancelEditCustomSection,
}) {
  return (
    <>
      {/* Interests */}
      <div className={cardStyle}>
        <div className="mb-4 flex items-center gap-3">
          <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${dark ? "bg-white text-black" : "bg-black text-white"}`}>
            <FaHeart />
          </div>
          <div>
            <h3 className="font-bold">Interests</h3>
            <p className={`text-xs ${dark ? "text-gray-400" : "text-gray-500"}`}>Add your professional interests.</p>
          </div>
        </div>

        <div className="flex gap-2 mb-3">
          <input type="text" value={newInterest} onChange={(e) => setNewInterest(e.target.value)} onKeyPress={handleInterestKeyPress} placeholder="Enter interest (e.g., AI, Web Development)" className={`flex-1 ${inputStyle}`} />
          <button onClick={addInterest} className={`px-4 py-2 rounded-xl flex items-center gap-2 ${dark ? "bg-white text-black hover:bg-gray-200" : "bg-black text-white hover:bg-gray-800"} transition`}>
            <span className="text-sm">+</span> Add
          </button>
        </div>

        <div className="flex flex-wrap gap-2">
          {interests.map((interest, index) => (
            <span key={index} className={`flex items-center gap-2 rounded-full px-3 py-1.5 text-sm ${dark ? "bg-white/10 text-white" : "bg-gray-200 text-gray-800"}`}>
              {interest}
              <button onClick={() => removeInterest(index)} className="hover:text-red-500 transition"><span className="text-xs">✕</span></button>
            </span>
          ))}
        </div>
      </div>

      {/* Hobbies */}
      <div className={cardStyle}>
        <div className="mb-4 flex items-center gap-3">
          <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${dark ? "bg-white text-black" : "bg-black text-white"}`}>
            <FaCog />
          </div>
          <div>
            <h3 className="font-bold">Hobbies</h3>
            <p className={`text-xs ${dark ? "text-gray-400" : "text-gray-500"}`}>Add your personal hobbies.</p>
          </div>
        </div>

        <div className="flex gap-2 mb-3">
          <input type="text" value={newHobby} onChange={(e) => setNewHobby(e.target.value)} onKeyPress={handleHobbyKeyPress} placeholder="Enter hobby (e.g., Reading, Gaming)" className={`flex-1 ${inputStyle}`} />
          <button onClick={addHobby} className={`px-4 py-2 rounded-xl flex items-center gap-2 ${dark ? "bg-white text-black hover:bg-gray-200" : "bg-black text-white hover:bg-gray-800"} transition`}>
            <span className="text-sm">+</span> Add
          </button>
        </div>

        <div className="flex flex-wrap gap-2">
          {hobbies.map((hobby, index) => (
            <span key={index} className={`flex items-center gap-2 rounded-full px-3 py-1.5 text-sm ${dark ? "bg-white/10 text-white" : "bg-gray-200 text-gray-800"}`}>
              {hobby}
              <button onClick={() => removeHobby(index)} className="hover:text-red-500 transition"><span className="text-xs">✕</span></button>
            </span>
          ))}
        </div>
      </div>

      {/* Awards */}
      <div className={cardStyle}>
        <div className="mb-4 flex items-center gap-3">
          <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${dark ? "bg-white text-black" : "bg-black text-white"}`}>
            <FaAward />
          </div>
          <div>
            <h3 className="font-bold">Awards & Honors</h3>
            <p className={`text-xs ${dark ? "text-gray-400" : "text-gray-500"}`}>Add your awards and achievements.</p>
          </div>
        </div>

        <div className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className={labelStyle}>Award Title</label>
              <input type="text" value={newAward.title} onChange={(e) => setNewAward({ ...newAward, title: e.target.value })} placeholder="Best Developer Award" className={inputStyle} />
            </div>
            <div>
              <label className={labelStyle}>Organization</label>
              <input type="text" value={newAward.organization} onChange={(e) => setNewAward({ ...newAward, organization: e.target.value })} placeholder="Google" className={inputStyle} />
            </div>
            <div>
              <label className={labelStyle}>Year</label>
              <input type="text" value={newAward.year} onChange={(e) => setNewAward({ ...newAward, year: e.target.value })} placeholder="2023" className={inputStyle} />
            </div>
            <div className="md:col-span-2">
              <label className={labelStyle}>Description</label>
              <textarea
                value={newAward.description}
                onChange={(e) =>
                  setNewAward({
                    ...newAward,
                    description: e.target.value,
                  })
                }
                placeholder="Award description..."
                rows={2}
                className={`${inputStyle} scrollbar-hide resize-none`}
              />
            </div>
          </div>

          <div className="flex gap-2">
            {editingAwardIndex !== null && (
              <button onClick={cancelEditAward} className="px-4 py-2 rounded-xl bg-gray-500 text-white hover:bg-gray-600 transition flex items-center gap-2">
                <FaTimes /> Cancel
              </button>
            )}
            <button onClick={addAward} className={`px-4 py-2 rounded-xl flex items-center gap-2 ${dark ? "bg-white text-black hover:bg-gray-200" : "bg-black text-white hover:bg-gray-800"} transition`}>
              {editingAwardIndex !== null ? <FaSave /> : <FaPlus />}
              {editingAwardIndex !== null ? "Update" : "Add"} Award
            </button>
          </div>

          {awards.length > 0 && (
            <div className="mt-4 space-y-2">
              {awards.map((award, index) => (
                <div key={index} className={`p-3 rounded-lg border ${dark ? "border-white/10 bg-black" : "border-gray-200 bg-white"}`}>
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-semibold">{award.title || "Award"}</h4>
                      <p className="text-sm text-gray-500">{award.organization || "Organization"}</p>
                      {award.year && <p className="text-xs text-gray-400">{award.year}</p>}
                      {award.description && <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">{award.description}</p>}
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => editAward(index)} className="text-blue-500 hover:text-blue-600"><FaEdit /></button>
                      <button onClick={() => removeAward(index)} className="text-red-500 hover:text-red-600"><FaTrash /></button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Publications */}
      <div className={cardStyle}>
        <div className="mb-4 flex items-center gap-3">
          <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${dark ? "bg-white text-black" : "bg-black text-white"}`}>
            <FaNewspaper />
          </div>
          <div>
            <h3 className="font-bold">Publications</h3>
            <p className={`text-xs ${dark ? "text-gray-400" : "text-gray-500"}`}>Add your publications.</p>
          </div>
        </div>

        <div className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="md:col-span-2">
              <label className={labelStyle}>Title</label>
              <input type="text" value={newPublication.title} onChange={(e) => setNewPublication({ ...newPublication, title: e.target.value })} placeholder="Research Paper Title" className={inputStyle} />
            </div>
            <div>
              <label className={labelStyle}>Publisher</label>
              <input type="text" value={newPublication.publisher} onChange={(e) => setNewPublication({ ...newPublication, publisher: e.target.value })} placeholder="IEEE" className={inputStyle} />
            </div>
            <div>
              <label className={labelStyle}>Date</label>
              <input type="date" value={newPublication.date} onChange={(e) => setNewPublication({ ...newPublication, date: e.target.value })} className={inputStyle} />
            </div>
            <div className="md:col-span-2">
              <label className={labelStyle}>URL</label>
              <input type="url" value={newPublication.url} onChange={(e) => setNewPublication({ ...newPublication, url: e.target.value })} placeholder="https://doi.org/..." className={inputStyle} />
            </div>
            <div className="md:col-span-2">
              <label className={labelStyle}>Authors</label>
              <input type="text" value={newPublication.authors} onChange={(e) => setNewPublication({ ...newPublication, authors: e.target.value })} placeholder="John Doe, Jane Smith" className={inputStyle} />
            </div>
          </div>

          <div className="flex gap-2">
            {editingPubIndex !== null && (
              <button onClick={cancelEditPublication} className="px-4 py-2 rounded-xl bg-gray-500 text-white hover:bg-gray-600 transition flex items-center gap-2">
                <FaTimes /> Cancel
              </button>
            )}
            <button onClick={addPublication} className={`px-4 py-2 rounded-xl flex items-center gap-2 ${dark ? "bg-white text-black hover:bg-gray-200" : "bg-black text-white hover:bg-gray-800"} transition`}>
              {editingPubIndex !== null ? <FaSave /> : <FaPlus />}
              {editingPubIndex !== null ? "Update" : "Add"} Publication
            </button>
          </div>

          {publications.length > 0 && (
            <div className="mt-4 space-y-2">
              {publications.map((pub, index) => (
                <div key={index} className={`p-3 rounded-lg border ${dark ? "border-white/10 bg-black" : "border-gray-200 bg-white"}`}>
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-semibold">{pub.title || "Publication"}</h4>
                      <p className="text-sm text-gray-500">{pub.publisher || "Publisher"}</p>
                      {pub.date && <p className="text-xs text-gray-400">{pub.date}</p>}
                      {pub.authors && <p className="text-xs text-gray-500">Authors: {pub.authors}</p>}
                      {pub.url && <a href={pub.url} target="_blank" rel="noopener" className="text-xs text-blue-500 hover:underline">View Publication</a>}
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => editPublication(index)} className="text-blue-500 hover:text-blue-600"><FaEdit /></button>
                      <button onClick={() => removePublication(index)} className="text-red-500 hover:text-red-600"><FaTrash /></button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Volunteering */}
      <div className={cardStyle}>
        <div className="mb-4 flex items-center gap-3">
          <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${dark ? "bg-white text-black" : "bg-black text-white"}`}>
            <FaHands />
          </div>
          <div>
            <h3 className="font-bold">Volunteering</h3>
            <p className={`text-xs ${dark ? "text-gray-400" : "text-gray-500"}`}>Add your volunteering experience.</p>
          </div>
        </div>

        <div className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className={labelStyle}>Organization</label>
              <input type="text" value={newVolunteering.organization} onChange={(e) => setNewVolunteering({ ...newVolunteering, organization: e.target.value })} placeholder="NGO Name" className={inputStyle} />
            </div>
            <div>
              <label className={labelStyle}>Role</label>
              <input type="text" value={newVolunteering.role} onChange={(e) => setNewVolunteering({ ...newVolunteering, role: e.target.value })} placeholder="Volunteer" className={inputStyle} />
            </div>
            <div>
              <label className={labelStyle}>Duration</label>
              <input type="text" value={newVolunteering.duration} onChange={(e) => setNewVolunteering({ ...newVolunteering, duration: e.target.value })} placeholder="2022-2023" className={inputStyle} />
            </div>
            <div className="md:col-span-2">
              <label className={labelStyle}>Description</label>
              <textarea value={newVolunteering.description} onChange={(e) => setNewVolunteering({ ...newVolunteering, description: e.target.value })} placeholder="What you did..." rows={2} className={inputStyle} />
            </div>
          </div>

          <div className="flex gap-2">
            {editingVolIndex !== null && (
              <button onClick={cancelEditVolunteering} className="px-4 py-2 rounded-xl bg-gray-500 text-white hover:bg-gray-600 transition flex items-center gap-2">
                <FaTimes /> Cancel
              </button>
            )}
            <button onClick={addVolunteering} className={`px-4 py-2 rounded-xl flex items-center gap-2 ${dark ? "bg-white text-black hover:bg-gray-200" : "bg-black text-white hover:bg-gray-800"} transition`}>
              {editingVolIndex !== null ? <FaSave /> : <FaPlus />}
              {editingVolIndex !== null ? "Update" : "Add"} Volunteering
            </button>
          </div>

          {volunteering.length > 0 && (
            <div className="mt-4 space-y-2">
              {volunteering.map((vol, index) => (
                <div key={index} className={`p-3 rounded-lg border ${dark ? "border-white/10 bg-black" : "border-gray-200 bg-white"}`}>
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-semibold">{vol.role || "Role"}</h4>
                      <p className="text-sm text-gray-500">{vol.organization || "Organization"}</p>
                      {vol.duration && <p className="text-xs text-gray-400">{vol.duration}</p>}
                      {vol.description && <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">{vol.description}</p>}
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => editVolunteering(index)} className="text-blue-500 hover:text-blue-600"><FaEdit /></button>
                      <button onClick={() => removeVolunteering(index)} className="text-red-500 hover:text-red-600"><FaTrash /></button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* References */}
      <div className={cardStyle}>
        <div className="mb-4 flex items-center gap-3">
          <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${dark ? "bg-white text-black" : "bg-black text-white"}`}>
            <FaUsers />
          </div>
          <div>
            <h3 className="font-bold">References</h3>
            <p className={`text-xs ${dark ? "text-gray-400" : "text-gray-500"}`}>Add your professional references.</p>
          </div>
        </div>

        <div className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className={labelStyle}>Full Name *</label>
              <input type="text" value={newReference.name} onChange={(e) => setNewReference({ ...newReference, name: e.target.value })} placeholder="John Doe" className={inputStyle} />
            </div>
            <div>
              <label className={labelStyle}>Designation *</label>
              <input type="text" value={newReference.designation} onChange={(e) => setNewReference({ ...newReference, designation: e.target.value })} placeholder="Senior Manager" className={inputStyle} />
            </div>
            <div>
              <label className={labelStyle}>Company</label>
              <input type="text" value={newReference.company} onChange={(e) => setNewReference({ ...newReference, company: e.target.value })} placeholder="Google" className={inputStyle} />
            </div>
            <div>
              <label className={labelStyle}>Email</label>
              <input type="email" value={newReference.email} onChange={(e) => setNewReference({ ...newReference, email: e.target.value })} placeholder="john@email.com" className={inputStyle} />
            </div>
            <div>
              <label className={labelStyle}>Phone</label>
              <input type="text" value={newReference.phone} onChange={(e) => setNewReference({ ...newReference, phone: e.target.value })} placeholder="+92 300 1234567" className={inputStyle} />
            </div>
            <div>
              <label className={labelStyle}>Relationship</label>
              <input type="text" value={newReference.relationship} onChange={(e) => setNewReference({ ...newReference, relationship: e.target.value })} placeholder="Manager" className={inputStyle} />
            </div>
          </div>

          <div className="flex gap-2">
            {editingRefIndex !== null && (
              <button onClick={cancelEditReference} className="px-4 py-2 rounded-xl bg-gray-500 text-white hover:bg-gray-600 transition flex items-center gap-2">
                <FaTimes /> Cancel
              </button>
            )}
            <button onClick={addReference} className={`px-4 py-2 rounded-xl flex items-center gap-2 ${dark ? "bg-white text-black hover:bg-gray-200" : "bg-black text-white hover:bg-gray-800"} transition`}>
              {editingRefIndex !== null ? <FaSave /> : <FaPlus />}
              {editingRefIndex !== null ? "Update" : "Add"} Reference
            </button>
          </div>

          {references.length > 0 && (
            <div className="mt-4 space-y-2">
              {references.map((ref, index) => (
                <div key={index} className={`p-3 rounded-lg border ${dark ? "border-white/10 bg-black" : "border-gray-200 bg-white"}`}>
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-semibold">{ref.name || "Name"}</h4>
                      <p className="text-sm text-gray-500">{ref.designation || "Designation"}</p>
                      {ref.company && <p className="text-xs text-gray-400">{ref.company}</p>}
                      {ref.email && <p className="text-xs text-gray-500">Email: {ref.email}</p>}
                      {ref.phone && <p className="text-xs text-gray-500">Phone: {ref.phone}</p>}
                      {ref.relationship && <p className="text-xs text-gray-400">Relationship: {ref.relationship}</p>}
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => editReference(index)} className="text-blue-500 hover:text-blue-600"><FaEdit /></button>
                      <button onClick={() => removeReference(index)} className="text-red-500 hover:text-red-600"><FaTrash /></button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Custom Sections */}
      <div className={cardStyle}>
        <div className="mb-4 flex items-center gap-3">
          <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${dark ? "bg-white text-black" : "bg-black text-white"}`}>
            <FaLayerGroup />
          </div>
          <div>
            <h3 className="font-bold">Custom Sections</h3>
            <p className={`text-xs ${dark ? "text-gray-400" : "text-gray-500"}`}>Add custom sections to your resume.</p>
          </div>
        </div>

        <div className="space-y-3">
          <div className="grid grid-cols-1 gap-3">
            <div>
              <label className={labelStyle}>Section Title *</label>
              <input
                type="text"
                value={newCustomSection.title}
                onChange={(e) => setNewCustomSection({ ...newCustomSection, title: e.target.value })}
                placeholder="e.g., Certifications, Volunteer Work"
                className={inputStyle}
              />
            </div>
            <div>
              <label className={labelStyle}>Content / Description</label>
              <textarea
                value={newCustomSection.content}
                onChange={(e) => setNewCustomSection({ ...newCustomSection, content: e.target.value })}
                placeholder="Describe the section content..."
                rows={3}
                className={inputStyle}
              />
            </div>
            <div>
              <label className={labelStyle}>Items (comma separated)</label>
              <input
                type="text"
                value={newCustomSection.items}
                onChange={(e) => setNewCustomSection({ ...newCustomSection, items: e.target.value })}
                placeholder="Item 1, Item 2, Item 3"
                className={inputStyle}
              />
            </div>
          </div>

          <div className="flex gap-2">
            {editingCustomIndex !== null && (
              <button
                onClick={cancelEditCustomSection}
                className="px-4 py-2 rounded-xl bg-gray-500 text-white hover:bg-gray-600 transition flex items-center gap-2"
              >
                <FaTimes /> Cancel
              </button>
            )}
            <button
              onClick={addCustomSection}
              className={`px-4 py-2 rounded-xl flex items-center gap-2 ${
                dark ? "bg-white text-black hover:bg-gray-200" : "bg-black text-white hover:bg-gray-800"
              } transition`}
            >
              {editingCustomIndex !== null ? <FaSave /> : <FaPlus />}
              {editingCustomIndex !== null ? "Update" : "Add"} Custom Section
            </button>
          </div>

          {customSections.length > 0 && (
            <div className="mt-4 space-y-2">
              {customSections.map((section, index) => (
                <div
                  key={index}
                  className={`p-3 rounded-lg border ${
                    dark ? "border-white/10 bg-black" : "border-gray-200 bg-white"
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-semibold">{section.title || "Custom Section"}</h4>
                      {section.content && (
                        <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">{section.content}</p>
                      )}
                      {section.items && Array.isArray(section.items) && section.items.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-1">
                          {section.items.map((item, i) => (
                            <span key={i} className="text-xs bg-gray-200 dark:bg-white/10 px-2 py-0.5 rounded">
                              {item}
                            </span>
                          ))}
                        </div>
                      )}
                      {section.items && typeof section.items === 'string' && (
                        <p className="text-xs text-gray-500 mt-1">{section.items}</p>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => editCustomSection(index)} className="text-blue-500 hover:text-blue-600">
                        <FaEdit />
                      </button>
                      <button onClick={() => removeCustomSection(index)} className="text-red-500 hover:text-red-600">
                        <FaTrash />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}