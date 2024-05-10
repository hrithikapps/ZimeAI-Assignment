import React, { useEffect, useState } from "react";
import { Input, Pagination, Select, Table, Tag } from "antd";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/LandingPage.css";
import ErrorComponent from "./ErrorComponent";

const { Search } = Input;
const { Option } = Select;

const highlightText = (text, query) => {
  if (!query.trim()) return text;
  const regex = new RegExp(`(${query})`, "gi");
  return text.split(regex).map((part, index) =>
    regex.test(part) ? (
      <span key={index} style={{ backgroundColor: "yellow" }}>
        {part}
      </span>
    ) : (
      part
    )
  );
};

const LandingPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    current: 1,
    limit: 10,
    total: 0,
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTags, setSelectedTags] = useState([]);
  const [allTags, setAllTags] = useState([]);
  const [error, setError] = useState("");

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `https://dummyjson.com/posts/search?q=${searchQuery}&skip=${
          (pagination.current - 1) * pagination.limit
        }&limit=${pagination.limit}`
      );

      const { posts, total } = response.data;
      setPosts(posts);
      setPagination((prev) => ({
        ...prev,
        total,
      }));
      const tags = posts.reduce((acc, post) => {
        post.tags.forEach((tag) => {
          if (!acc.includes(tag)) {
            acc.push(tag);
          }
        });
        return acc;
      }, []);

      setAllTags(tags);
      setLoading(false);
      setError(null);
    } catch (error) {
      setError("Failed to fetch data. Please try again later.");
      console.error("Error fetching data:", error);
      setLoading(false);
    }
  };

  const handlePaginationChange = (page, limit) => {
    setPagination((prevPagination) => ({
      ...prevPagination,
      current: page,
      limit,
    }));
    navigate(`?page=${page}`);
  };

  const handleSubmit = () => {
    fetchData();
    setPagination((prev) => ({
      ...prev,
      current: 1,
    }));
    navigate(`?page=1&search=${searchQuery}`);
  };

  const handleInputChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleTagChange = (value) => {
    setSelectedTags(value);
    setPagination((prev) => ({
      ...prev,
      current: 1,
    }));
    navigate(`?page=1&tags=${value.join("+")}`);
  };

  const filteredPosts = selectedTags.length
    ? posts.filter((post) =>
        selectedTags.every((tag) => post.tags.includes(tag))
      )
    : posts;

  useEffect(() => {
    fetchData();
  }, [location]);

  useEffect(() => {
    const debounceSearch = setTimeout(() => {
      fetchData();
    }, 250);

    return () => clearTimeout(debounceSearch);
  }, [searchQuery, pagination.current, pagination.limit]);

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
      render: (text) => highlightText(text, searchQuery),
    },
    {
      title: "Tags",
      dataIndex: "tags",
      key: "tags",
      responsive: ["lg"],
      render: (tags) => (
        <>
          {tags.map((tag) => (
            <Tag color="blue" key={tag}>
              {tag.toUpperCase()}
            </Tag>
          ))}
        </>
      ),
    },
  ];

  if (error) {
    return <ErrorComponent error={error} />;
  }

  return (
    <>
      <section>
        <div className="content-container">
          <h2>Placeholder Posts</h2>
          <section
            className="header-container"
            style={{
              flexDirection: window.innerWidth <= 576 ? "column" : "row",
            }}
          >
            <Search
              placeholder="input search text"
              onSearch={handleSubmit}
              style={{ maxWidth: 200 }}
              onChange={handleInputChange}
              value={searchQuery}
              className="searchbar"
            />
            <Select
              mode="multiple"
              style={{ minWidth: 200 }}
              placeholder="Filter by Tags"
              onChange={handleTagChange}
              defaultValue={selectedTags}
              className="selectedTags"
            >
              {allTags.map((tag) => (
                <Option key={tag} value={tag}>
                  {tag}
                </Option>
              ))}
            </Select>
          </section>

          <Table
            dataSource={filteredPosts}
            columns={columns}
            loading={loading}
            pagination={false}
            rowKey="id"
            style={{ width: "100%" }}
          />

          <Pagination
            current={pagination.current}
            pageSize={pagination.pageSize}
            total={pagination.total}
            onChange={handlePaginationChange}
            className="pagination"
          />
        </div>
      </section>
    </>
  );
};

export default LandingPage;
