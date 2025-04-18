import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { staffService } from '../../services/staffService';

const ViewStaff = () => {
  const { id } = useParams();
  const [staff, setStaff] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStaff = async () => {
      try {
        const data = await staffService.getStaffById(id);
        setStaff(data);
      } catch (err) {
        setError('Failed to load staff: ' + err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchStaff();
  }, [id]);

  if (loading) return <div className="center-message">Loading...</div>;
  if (error) return <div className="error-message">{error}</div>;
  if (!staff) return <div className="center-message">Staff not found</div>;

  return (
    <div>
      <style>
        {`
          .staff-container {
            max-width: 700px;
            margin: 40px auto;
            padding: 30px;
            background-color: #fff;
            border-radius: 16px;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          }

          .staff-title {
            font-size: 28px;
            font-weight: bold;
            color: #4b2e2e;
            text-align: center;
            margin-bottom: 24px;
          }

          .staff-details {
            font-size: 16px;
            color: #333;
            display: flex;
            flex-direction: column;
            gap: 14px;
          }

          .label {
            font-weight: 600;
            color: #4b2e2e;
          }

          .status-active {
            color: green;
            font-weight: bold;
          }

          .status-inactive {
            color: red;
            font-weight: bold;
          }

          .edit-button-container {
            text-align: center;
            margin-top: 30px;
          }

          .edit-button {
            background-color: #faf089;
            color: #d69e2e;
            padding: 10px 20px;
            font-weight: 500;
            border-radius: 8px;
            text-decoration: none;
            transition: background-color 0.3s ease;
          }

          .edit-button:hover {
            background-color: #edf2f7;
          }

          .center-message {
            text-align: center;
            margin-top: 100px;
            font-size: 18px;
            color: #555;
          }

          .error-message {
            text-align: center;
            margin-top: 100px;
            font-size: 18px;
            color: red;
          }
        `}
      </style>

      <div className="staff-container">
        <h2 className="staff-title">Staff Details</h2>
        <div className="staff-details">
          <Detail label="Staff ID" value={staff.staffId} />
          <Detail label="Name" value={staff.name} />
          <Detail label="Department" value={staff.department} />
          <Detail label="Designation" value={staff.designation || '-'} />
          <Detail label="Cabin No" value={staff.cabinNo || '-'} />
          <Detail label="Year of Joining" value={staff.yearOfJoining} />
          <Detail label="Phone Number" value={staff.phoneNumber || '-'} />
          <Detail label="Email" value={staff.email || '-'} />
          <div>
            <span className="label">Status:</span>{' '}
            <span className={staff.active ? 'status-active' : 'status-inactive'}>
              {staff.active ? 'Active' : 'Inactive'}
            </span>
          </div>
        </div>

        <div className="edit-button-container">
          <Link to={`/staff/edit/${staff._id}`} className="edit-button">
            Edit Staff
          </Link>
        </div>
      </div>
    </div>
  );
};

const Detail = ({ label, value }) => (
  <div>
    <span className="label">{label}:</span> {value}
  </div>
);

export default ViewStaff;
