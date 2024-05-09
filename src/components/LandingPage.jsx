import React, { useEffect, useState } from "react";
// import { useLocation, useHistory } from "react-router-dom";
import { Table, Tag } from "antd";
import { useLocation } from "react-router-dom";

const LandingPage = () => {
  const [posts, setPosts] = useState("");
  const location = useLocation();
  const fetchData = async () => {
    try {
      const response = await fetch(`https://dummyjson.com/posts`);
      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }
      const data = await response.json();
      setPosts(data.posts);
      console.log(data);
    } catch (error) {
      console.error("Error Fetching Data", error.message);
    }
  };

  useEffect(() => {
    fetchData();
  }, [location]);

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      render: (text) => <a>{text}</a>,
    },
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "Body",
      dataIndex: "body",
      key: "body",
    },
    {
      title: "Tags",
      key: "tags",
      dataIndex: "tags",
      render: (tags) => (
        <>
          {tags.map((tag) => (
            <Tag color="blue" key={tag}>{tag.toUpperCase()}</Tag>
          ))}
        </>
      ),
    },
  ];

  if (!posts) {
    return;
  }
  return (
    <>
      <Table columns={columns} dataSource={posts} loading={loading}
 />
    </>
  );
};

export default LandingPage;
