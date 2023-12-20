import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import logo_kortrijk from '../assets/logo_kortrijk.png';

const Nav = () => {
    const [departments, setDepartments] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetch('https://api-debiecht.jaridewulf.be/departments')
            .then(response => response.json())
            .then(data => setDepartments(data))
            .catch(error => console.log(error));
    }, []);

    const navigateToDepartment = (department) => {
        navigate(`/department/${department.id}`, {
            state: { departmentName: department.name },
        });
    };

    return (
        <nav>
            <img src={logo_kortrijk} alt="Logo Kortrijk" className='logo' height={200} width={165} />
            <div
                onClick={() => navigate('/', { state: { departmentName: 'Stad Kortrijk' } })}
                className={`nav__link`}
            >
                Departementen
            </div>
            {departments.map(department => (
                <div
                    key={department.id}
                    onClick={() => navigateToDepartment(department)}
                    className={`nav__link nav__link__sub`}
                >
                    {department.name}
                </div>
            ))}
        </nav>
    );
};

export default Nav;
