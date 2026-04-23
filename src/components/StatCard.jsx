import React from 'react';
import PropTypes from 'prop-types';

export function StatCard({ title, value, icon, color }) {
  const colorMap = {
    blue: {
      bg: 'bg-blue-50',
      text: 'text-blue-600',
      border: 'border-blue-200',
      iconBg: 'bg-blue-100',
    },
    green: {
      bg: 'bg-green-50',
      text: 'text-green-600',
      border: 'border-green-200',
      iconBg: 'bg-green-100',
    },
    purple: {
      bg: 'bg-purple-50',
      text: 'text-purple-600',
      border: 'border-purple-200',
      iconBg: 'bg-purple-100',
    },
    red: {
      bg: 'bg-red-50',
      text: 'text-red-600',
      border: 'border-red-200',
      iconBg: 'bg-red-100',
    },
    yellow: {
      bg: 'bg-yellow-50',
      text: 'text-yellow-600',
      border: 'border-yellow-200',
      iconBg: 'bg-yellow-100',
    },
    indigo: {
      bg: 'bg-indigo-50',
      text: 'text-indigo-600',
      border: 'border-indigo-200',
      iconBg: 'bg-indigo-100',
    },
  };

  const colors = colorMap[color] || colorMap.blue;

  return (
    <div
      className={`rounded-lg border ${colors.border} ${colors.bg} p-6 shadow-sm transition-shadow hover:shadow-md`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className={`mt-2 text-3xl font-bold ${colors.text}`}>{value}</p>
        </div>
        {icon && (
          <div
            className={`flex h-12 w-12 items-center justify-center rounded-full ${colors.iconBg}`}
          >
            <span className={`text-2xl ${colors.text}`}>{icon}</span>
          </div>
        )}
      </div>
    </div>
  );
}

StatCard.propTypes = {
  title: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  icon: PropTypes.node,
  color: PropTypes.oneOf(['blue', 'green', 'purple', 'red', 'yellow', 'indigo']),
};

StatCard.defaultProps = {
  icon: null,
  color: 'blue',
};