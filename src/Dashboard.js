import React, { useState, useEffect } from 'react';
import './Dashboard.css';
import ReporteTabla from './ReporteTabla';
import Chart1 from './Chart1';
import Chart2 from './Chart2';
import Chart3 from './Chart3';
import Chart4 from './Chart4';
import Chart5 from './Chart5';
import Chart6 from './Chart6';

import axios from 'axios';

const Dashboard = () => {
  const [selectedYear, setSelectedYear] = useState('2024');
  const [data, setData] = useState([]);
  const [brandSearch, setBrandSearch] = useState('');
  const [brandSuggestions, setBrandSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const tableIds = {
    '2022': 'mjkna8fbfpdh6vc',
    '2023': 'm015jrlsv82sydz',
    '2024': 'mpq79q0vqaa13ep'
  };

  const handleYearChange = (event) => {
    const newYear = event.target.value;
    setSelectedYear(newYear);
    fetchData(newYear, brandSearch);
  };

  const handleBrandSearchChange = (event) => {
    const value = event.target.value;
    setBrandSearch(value);

    if (value.length >= 3) {
      const suggestions = [...new Set(data
        .filter(item => item.Marca.toLowerCase().includes(value.toLowerCase()))
        .map(item => item.Marca))]
        .slice(0, 5); // Limitar a 5 sugerencias
      setBrandSuggestions(suggestions);
    } else {
      setBrandSuggestions([]);
    }

    // Si el campo de búsqueda está vacío, volver a cargar los datos por defecto
    if (value === '') {
      fetchData(selectedYear, '');
    }
  };

  const handleBrandSelect = (brand) => {
    setBrandSearch(brand);
    setBrandSuggestions([]);
    fetchData(selectedYear, brand);
  };

  const fetchData = async (year, brand) => {
    setIsLoading(true);
    try {
      const response = await axios.get(`https://nocodb-production-5c0d.up.railway.app/api/v2/tables/${tableIds[year]}/records`, {
        params: {
          limit: 1000,
          where: brand ? `(Marca,like,${brand}%)` : '',
        },
        headers: {
          'xc-token': '5d2NqaEUVixkksswn1CNUUr73BRJvii-NXvls4zv'
        }
      });
      setData(response.data.list);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData(selectedYear, brandSearch);
  }, [selectedYear, brandSearch]);

  return (
    <div className="dashboard">
      <div className="selectors">
        <select 
          className="selector" 
          value={selectedYear} 
          onChange={handleYearChange}
        >
          <option value="">Seleccionar Año</option>
          {Object.keys(tableIds).map(year => (
            <option key={year} value={year}>{year}</option>
          ))}
        </select>
        <div className="brand-search-container">
          <input
            type="text"
            placeholder="Buscar Marca"
            value={brandSearch}
            onChange={handleBrandSearchChange}
          />
          {brandSuggestions.length > 0 && (
            <ul className="brand-suggestions">
              {brandSuggestions.map((brand, index) => (
                <li key={index} onClick={() => handleBrandSelect(brand)}>
                  {brand}
                </li>
              ))}
            </ul>
          )}
        </div>
        
      </div>

      <div className="content-container">
        {isLoading && (
          <div className="loading-overlay">
            <div className="loading-spinner"></div>
          </div>
        )}
        <div className="charts-container">
          <div className="chart">
            <Chart1 data={data} selectedYear={selectedYear} brandSearch={brandSearch} />
          </div>
          <div className="chart">
            <Chart2 data={data} brandSearch={brandSearch} />
          </div>
          <div className="chart">
            <Chart3 data={data} brandSearch={brandSearch} />
          </div>
          <div className="chart">
            <Chart4 data={data} brandSearch={brandSearch} />
          </div>
          <div className="chart">
            <Chart5 data={data} brandSearch={brandSearch} />
          </div>
          <div className="chart">
            <Chart6 data={data} brandSearch={brandSearch} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
