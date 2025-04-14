import { DatePicker, Checkbox, Avatar, Divider, } from "antd";
import { UserOutlined, CalendarOutlined, CheckCircleOutlined, } from "@ant-design/icons";

const TaskFilterPanel = ({
  filter,
  setFilter,
  assigneeList
}) => {

  return (
    <div style={{ padding: 12, width: 280 }}>
      <h4 style={{ marginBottom: 12, fontWeight: 600 }}>FILTERS</h4>
      <Checkbox
        checked={filter.assignedToMe}
        onChange={(e) => setFilter({ ...filter, assignedToMe: e.target.checked })}
      >
        <UserOutlined /> Assigned to me
      </Checkbox>
      <br />
      <Checkbox
        checked={filter.dueThisWeek}
        onChange={(e) => setFilter({ ...filter, dueThisWeek: e.target.checked })}
      >
        <CalendarOutlined /> Due this week
      </Checkbox>
      <br />
      <Checkbox
        checked={filter.doneOnly}
        onChange={(e) => setFilter({ ...filter, doneOnly: e.target.checked })}
      >
        <CheckCircleOutlined /> Done items
      </Checkbox>
      <Divider />

      <div style={{ marginBottom: 8 }}>Date range</div>
      <DatePicker.RangePicker
        value={filter.dateRange}
        onChange={(value) => setFilter({ ...filter, dateRange: value })}
        style={{ width: "100%" }}
      />
      <Divider />

      <div style={{ marginBottom: 8 }}>Assigned</div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
        {assigneeList.map((name) => (
          <Avatar key={name} style={{ backgroundColor: "#7b61ff", cursor: "pointer" }}>
            {name[0].toUpperCase()}
          </Avatar>
        ))}
      </div>
    </div>
  );
};

export default TaskFilterPanel;
