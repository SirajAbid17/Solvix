import React from "react";

const ResumeSection = ({ icon: Icon, title, subtitle, dark, cardStyle, children }) => {
  return (
    <div className={`rounded-2xl p-6 ${cardStyle} transition-all duration-300`}>
      <div className="flex items-center gap-3 mb-6">
        <div className={`p-3 rounded-xl ${dark ? "bg-white/10" : "bg-gray-100"}`}>
          <Icon className={`h-6 w-6 ${dark ? "text-white" : "text-gray-800"}`} />
        </div>
        <div>
          <h3 className={`text-xl font-bold ${dark ? "text-white" : "text-gray-800"}`}>
            {title}
          </h3>
          {subtitle && (
            <p className={`text-sm ${dark ? "text-gray-400" : "text-gray-500"}`}>
              {subtitle}
            </p>
          )}
        </div>
      </div>
      {children}
    </div>
  );
};

export default ResumeSection;