import React, { useEffect } from "react";
import {
  Modal,
  Form,
  Input,
  DatePicker,
  Select,
} from "antd";
import dayjs from "dayjs";
import { PRIORITY_OPTIONS } from "../data/constants";

const { TextArea } = Input;

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
      title={initialData?.key ? "แก้ไขงาน" : "เพิ่มงานใหม่"}
      open={open}
      onCancel={onClose}
      onOk={() => form.submit()}
      okText="บันทึก"
    >
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <Form.Item
          name="title"
          label="ชื่องาน"
          rules={[{ required: true, message: "กรุณากรอกชื่องาน" }]}
        >
          <Input placeholder="ชื่อ task หรือหัวข้อ" />
        </Form.Item>

        <Form.Item name="assignee" label="ผู้รับผิดชอบ">
          <Input />
        </Form.Item>

        <Form.Item name="dueDate" label="วันครบกำหนด">
          <DatePicker />
        </Form.Item>

        <Form.Item name="priority" label="Priority">
          <Select options={PRIORITY_OPTIONS} />
        </Form.Item>

        <Form.Item name="description" label="รายละเอียดเพิ่มเติม">
          <TextArea rows={3} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default TaskModal;
