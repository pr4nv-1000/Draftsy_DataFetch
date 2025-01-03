"use client"
import React, { useRef, useState } from 'react';
import { SearchOutlined } from '@ant-design/icons';
import { Button, Input, Space, Table } from 'antd';
import Highlighter from 'react-highlight-words';
import data from "../Data.json"
import { DownOutlined } from '@ant-design/icons';
import { Dropdown } from 'antd';
const items = [
  {
    label: 'NCAA Football',
    key: 2,
  },
  {
    label: 'Basketball',
    key: 3,
  },
  {
    label: 'NFL',
    key: 9,
  },
  {
    label: 'ProBase Ball',
    key: 7,
  },
  {
    label: 'NCAA Baseball',
    key: 1,
  },
  {
    label: 'NCAA Hockey',
    key: 4,
  },
  {
    label: 'NCAA Soccer',
    key: 5,
  },
];

const App = () => {
  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const [dataSource, setDataSource] = useState([]);
  const [selectedSport, setSelectedSport] = useState(2);
  const searchInput = useRef(null);

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchText('');
  };

  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
      <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{ marginBottom: 8, display: 'block' }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Search
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{ width: 90 }}
          >
            Reset
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              confirm({ closeDropdown: false });
              setSearchText(selectedKeys[0]);
              setSearchedColumn(dataIndex);
            }}
          >
            Filter
          </Button>
          <Button type="link" size="small" onClick={() => close()}>
            Close
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined style={{ color: filtered ? '#1677ff' : undefined }} />
    ),
    onFilter: (value, record) =>
      record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
    filterDropdownProps: {
      onOpenChange(open) {
        if (open) {
          setTimeout(() => searchInput.current?.select(), 100);
        }
      },
    },
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ''}
        />
      ) : (
        text
      ),
  });

  const columns = [
    {
      title: 'Team 1 Name',
      dataIndex: 'team1name',
      key: 'team1name',
      ...getColumnSearchProps('team1name'),
    },
    {
      title: 'Team 2 Name',
      dataIndex: 'team2name',
      key: 'team2name',
      ...getColumnSearchProps('team2name'),
    },
    {
      title: 'Team 1 Score',
      dataIndex: 'team1score',
      key: 'team1score',
    },
    {
      title: 'Team 2 Score',
      dataIndex: 'team2score',
      key: 'team2score',
    },
    {
      title: 'Match Status',
      dataIndex: 'match_status',
      key: 'match_status',
      ...getColumnSearchProps('match_status'),
    },
    {
      title: 'Points Calculation Status',
      dataIndex: 'Points_Cal_Status',
      key: 'Points_Cal_Status',
    },
  ];

  const fetchData = async (id) => {
    try {
      const response = await fetch(`/api/${id}`);
      const { rows } = await response.json(); // Assuming the API returns { rows: [...] }
  
      // Map rows to match the table structure
      const formattedData = rows.map((row, index) => ({
        key: index, // Use a unique identifier, e.g., index or row.id if available
        team1name: row.team1name,
        team2name: row.team2name,
        team1score: row.team1score,
        team2score: row.team2score,
        match_status: row.match_status,
        Points_Cal_Status: row.Points_Cal_Status,
      }));
  
      setDataSource(formattedData); // Update the table data state
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleSportSelect = (id) => {
    setSelectedSport(id);
    fetchData(id); // Fetch data based on the selected sport ID
  };

  return (
    <>
      <div className="flex overflow-x-hidden flex-col w-full h-full bg-white">


        <div className="flex w-full my-5 mx-10">
          <h2 className='text-xl font-bold'>Select a Sport -  <Dropdown
            menu={{
              items: items.map(item => ({
                ...item,
                onClick: () => handleSportSelect(item.key),
              })),
            }}
            trigger={['click']}
          >
            <button className='text-sm px-2 py-1 bg-gray-300 rounded-md' onClick={(e) => e.preventDefault()}>
              <Space>
                Sports
                <DownOutlined />
              </Space>
            </button>
          </Dropdown></h2>
          <button className='text-sm ms-6 font-bold px-3 py-1  border-2 rounded-md' onClick={() => fetchData(selectedSport)}>
            <Space>
              Fetch
            </Space>
          </button>
        </div>

        <div className="mx-10 w-[90%] mb-10 h-full">
          <Table
            className="px-5 mb-10"
            columns={columns}
            dataSource={dataSource} // Use the fetched data here
          />
        </div>

      </div>
    </>
  );
};

export default App;