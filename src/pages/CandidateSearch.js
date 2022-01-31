import React, { useState, useEffect } from "react";
import styled from "styled-components";
import Navbar from "../components/Navbar";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Form from "react-bootstrap/Form";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import StyledButton from "../components/StyledButton";
import ApplicantCardModal from "../components/Modal/ApplicantCardModal";
import Swal from "sweetalert2";
import axios from "axios";
import {
  getAllCandidates,
} from "../API/endpoints";

function CandidateSearch({
  activeJob,
  activeCandidate,
  setActiveCandidate,
  setCandidateState,
  candidateState,
  setActiveJob,
  nickName,
  colorScheme,
}) {
  const [validated, setValidated] = useState(false);
  const [allCandidates, setAllCandidates] = useState([]);//Lös detta i backend i framtiden så man inte får en lista på alla kandidater
  const [searchResult, setSearchResult] = useState([]);

  useEffect(() => {
    axios.get(`${getAllCandidates}`,
    { headers: { Authorization: localStorage.getItem("jwtToken") } }
      ).then(resp => {
    setAllCandidates(resp.data)
    })
    
  }, []);
  console.log(allCandidates)

  function searchForCompetence(event) {
    event.preventDefault();
    if (event.currentTarget.checkValidity() === false) {
      event.stopPropagation();
    } else {
      setSearchResult([]);
      let noMatch = true;
      const CompetenceToSearch = event.currentTarget.competence.value;
      const YearsToSearch = event.currentTarget.years.value;
      let newSearchResult = [];
      allCandidates.map((candidateInMap, index) => {
        console.log(candidateInMap.competenciesList.length)
        if(candidateInMap.competenciesList.length>=1){
          candidateInMap.competenciesList.map((competenceInMap) => {
            if (
              competenceInMap.name.toLowerCase().includes(CompetenceToSearch.toLowerCase()) &&
              competenceInMap.value >= YearsToSearch
            ) {
              newSearchResult = [...newSearchResult, allCandidates[index]];
              setSearchResult(newSearchResult);
              noMatch=false
            }
          });
        }else{console.log("no experience")}
      });
      if(noMatch) {
        Swal.fire({
          icon: "error",
          title: "No Candidate found",
          text: "Did not find any candidate whith that searching criteria, try to lower the years of exprerience or search for an other competence",
          showDenyButton: false,
          showCancelButton: false,
          confirmButtonText: "Ok",
        })
      }
    }
    setValidated(true);
  }
  console.log(searchResult)

  return (
    <div>
      <Navbar
        colorScheme={colorScheme}
        setActiveJob={setActiveJob}
        setActiveCandidate={setActiveCandidate}
        activeCandidate={activeCandidate}
      />
      <Header colorScheme={colorScheme} activeJob={activeJob} />
      <Container inputColor={colorScheme}>
        <H3>Candidate Search</H3>
          <SearchDiv>
            <H5>Search for Candidate</H5>

            <Form
              noValidate
              validated={validated}
              onSubmit={searchForCompetence}
            >
              <InputDiv>
                <FloatingLabel controlId="competence" label="Competence">
                  <Form.Control required type="text" placeholder='"Java"' />
                  <Form.Control.Feedback type="invalid">
                    This field can not be empty
                  </Form.Control.Feedback>
                </FloatingLabel>
                <FloatingLabel controlId="years" label="Years">
                  <Form.Control required type="number" placeholder='"Java"' />
                  <Form.Control.Feedback type="invalid">
                    This field can not be empty
                  </Form.Control.Feedback>
                </FloatingLabel>
              </InputDiv>
              <StyledBtnDiv>
              <StyledButton
                type="submit"
                input="Search"
                colorScheme={colorScheme}
              />
              </StyledBtnDiv>
            </Form>
          </SearchDiv>
          <ListOfResultDiv>
          {searchResult.map((candidate, index) => {
            return (
              <SearchedCandidateDiv inputColor={colorScheme} >
                <ApplicantCardModal
                  key={candidate.id}
                  candidate={candidate}
                  candidateState={candidateState}
                  setCandidateState={setCandidateState}
                  activeJobId={activeJob.id}
                  nickName={nickName}
                  colorScheme={colorScheme}
                />
              </SearchedCandidateDiv>
            );
          })}
          </ListOfResultDiv>
      </Container>
      <Footer colorScheme={colorScheme} />
    </div>
  );
}

export default CandidateSearch;


const Container = styled.div`
    position: fixed;
    height: 100%;
    width: 100%;
    background-color: ${(props) => props.inputColor.primary};
    color: ${(props) => props.inputColor.text};
    padding-bottom: 5%;
    margin-left 160px;
    padding-left: 10px;
    
`;

const SearchDiv = styled.div`
  padding-bottom: 50px;
  
`;

const InputDiv = styled.div`
  display: flex;
`;

const ListOfResultDiv = styled.div`
  display: flex;
  flex-wrap: wrap;
`;

const H3 = styled.h3`
  display: flex;
  margin-left: 50px;
  margin-right: 400px;
  font-family: "Trebuchet MS", sans-serif;
`;

const H5 = styled.h5`
  display: flex;
  margin-left: 50px;
  margin-right: 400px;
  font-family: "Trebuchet MS", sans-serif;
`;

const SearchedCandidateDiv = styled.div` 
  display: flex;
  flex-wrap: wrap;
  border: 1px solid ${(props) => props.inputColor.fifth};
  border-radius: 2px;
  padding: 8px;
  margin: 8px 8px 8px 8px;
  color: ${(props) => props.inputColor.text};
  background-color: ${(props) =>
    props.isDragging ? props.inputColor.fourth : props.inputColor.secondary};
`

const StyledBtnDiv = styled.div`
 margin-top: 10px;
`;

