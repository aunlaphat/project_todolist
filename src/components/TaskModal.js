import React, { useEffect } from "react";
import { Modal, Form, Input, DatePicker, Select, Typography, } from "antd";
import {EditOutlined, UserOutlined, CalendarOutlined, RocketOutlined, FileTextOutlined, } from "@ant-design/icons";
import dayjs from "dayjs";
import { PRIORITY_OPTIONS } from "../data/constants";

const { TextArea } = Input;
const { Title } = Typography;

const TaskModal = ({ open, onClose, onSave, initialData }) => {
    const [form] = Form.useForm();

    useEffect(() => {
      if (initialData) {
        form.setFieldsValue({
          ...initialData,
          dueDate: initialData.dueDate ? dayjs(initialData.dueDate) : null,
        });
      } else {
        form.resetFields();
      }
    }, [initialData, form]);
  
    const handleSubmit = (values) => {
      const task = {
        ...initialData,
        ...values,
        dueDate: values.dueDate ? values.dueDate.toISOString() : null,
        status: initialData?.status || "TO DO",
        updatedAt: new Date(),
      };
  
      if (!task.key) {
        task.createdAt = new Date();
      }
  
      onSave(task);
    };
  
    return (
      <Modal
        title={
          <Title level={4} style={{ margin: 0, color: "#7b61ff", display: "flex", alignItems: "center", gap: 8 }}>
            <EditOutlined />
            {initialData?.key ? "แก้ไขงาน" : "เพิ่มงานใหม่"}
          </Title>
        }
        open={open}
        onCancel={onClose}
        onOk={() => form.submit()}
        okText="บันทึก"
        cancelText="ยกเลิก"
        forceRender
        okButtonProps={{
          style: {
            backgroundColor: "#7b61ff",
            borderColor: "#7b61ff",
          },
        }}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          style={{ marginTop: 16 }}
        >
          <Form.Item
            name="title"
            label={<><EditOutlined /> ชื่องาน</>}
            rules={[{ required: true, message: "กรุณากรอกชื่องาน" }]}
          >
            <Input placeholder="ชื่อ task หรือหัวข้อ" />
          </Form.Item>
  
          <Form.Item name="assignee" label={<><UserOutlined /> ผู้รับผิดชอบ</>}>
            <Input placeholder="ชื่อผู้รับผิดชอบ" />
          </Form.Item>
  
          <Form.Item name="dueDate" label={<><CalendarOutlined /> วันครบกำหนด</>}>
            <DatePicker style={{ width: "100%" }} />
          </Form.Item>
  
          <Form.Item name="priority" label={<><RocketOutlined /> Priority</>}>
            <Select
              options={PRIORITY_OPTIONS}
              placeholder="เลือกความสำคัญ"
            />
          </Form.Item>
  
          <Form.Item name="description" label={<><FileTextOutlined /> รายละเอียดเพิ่มเติม</>}>
            <TextArea rows={3} placeholder="คำอธิบายงานเพิ่มเติม" />
          </Form.Item>
        </Form>
      </Modal>
    );
  };

export default TaskModal;
