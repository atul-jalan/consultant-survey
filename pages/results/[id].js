import React, { useEffect, useState, useCallback } from "react";
import fire from "../../config/fire-config";
import { Bar } from "react-chartjs-2";

const useResults = ({ id }) => {
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);
  const [percentDist, setPercentDist] = useState([
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  ]);
  const [careerDist, setCareerDist] = useState([0, 0, 0, 0, 0, 0, 0]);

  useEffect(() => {
    const getData = async () => {
      // retrieve data from firestore
      const snapshot = await fire.firestore().collection("responses").get();

      const documents = {};
      snapshot.forEach((doc) => {
        documents[doc.id] = doc.data();
      });

      setData(documents);

      // construct percentage distributions array
      const values = Object.values(documents);
      const pDist = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

      for (let i = 0; i < values.length; i += 1) {
        const idx = Math.floor(values[i].RESULT / 10);
        pDist[idx] += 1;
      }

      setPercentDist(pDist);

      // construct career plans distributions array
      const cDist = [0, 0, 0, 0, 0, 0, 0];
      for (let i = 0; i < values.length; i += 1) {
        cDist[values[i].answer] += 1;
      }

      setCareerDist(cDist);

      // set loading to finished
      setLoading(false);
    };
    getData();
  }, []);

  return [data, percentDist, careerDist, loading];
};

const Results = ({ id }) => {
  const [data, percentageDistribution, careerDistribution, isLoading] =
    useResults({ id });

  if (isLoading) return <p>Loading...</p>;

  return (
    <div className="flex justify-center align-center bg-color-background">
      <div className="font-main flex flex-column justify-center align-center" style={{width: '1080px'}}>
        <Title percent={Math.round(data[id].RESULT)} isConsultant={data[id].answer === 0} />
        <OtherConsultantsGraph percentageDistro={percentageDistribution} yourPercent={Math.round(data[id].RESULT)} />
        <CareerChoicesGraph otherCareerChoices={careerDistribution} yourCareerChoice={data[id].answer} />
        <Share />
      </div>
    </div>
  );
};

const Title = ({ percent, isConsultant }) => {
  
  const getSentences = useCallback(() => {
    const shouldSwitch = 'Have you considered switching majors?';
    const shouldNotSwitch = 'Seems like you chose the right major!'
    
    const likelyConsultant = 'You have a ' + percent + '% chance of becoming a consultant.'
    const notLikelyConsultant = 'You only have a ' + percent + '% chance of becoming a consultant.'

    if (percent >= 40) {
      return isConsultant ? [shouldNotSwitch, likelyConsultant] : [shouldSwitch, likelyConsultant]
    } else if (percent < 40) {
      return isConsultant ? [shouldSwitch, notLikelyConsultant] : [shouldNotSwitch, notLikelyConsultant]
    }

  }, [percent, isConsultant])

  return (
    <div className="flex flex-column align-center justify-center" style={{height: '100vh'}}>
      <p className="h1 font-main secondary-accent fw-black marginbottom-24">{getSentences()[0]}</p>
      <p className="h1 font-main primary-accent fw-black">{getSentences()[1]}</p>
    </div>
  )
}

const OtherConsultantsGraph = ({ percentageDistro, yourPercent }) => {

  const [average, setAverage] = useState(0)

  useEffect(() => {
    let currCount = 0;
    let currSum = 0;

    for (let i = 0; i < percentageDistro.length; i += 1) {
      const amount = ((i + 1) * 10) - 5;
      currSum += amount * percentageDistro[i]
      currCount += percentageDistro[i]
    }

    const _average = Math.round(currSum / currCount);

    setAverage(_average)
  }, [])

  const relationshipToAverage = useCallback(() => {
    if (yourPercent < average) return 'below';
    else if (yourPercent > average) return 'above';
    else return 'about the same as';

  }, [average])

  const consultantChance = {
    labels: [
      "0-10%",
      "10-20%",
      "20-30%",
      "30-40%",
      "40-50%",
      "50-60%",
      "60-70%",
      "70-80%",
      "80-90%",
      "90-100%",
    ],
    datasets: [
      {
        label: "# of People in Category",
        data: percentageDistro,
        backgroundColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(153, 102, 255, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(153, 102, 255, 1)",
          "rgba(255, 159, 64, 1)",
          "rgba(153, 102, 255, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(255, 159, 64, 1)",
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(153, 102, 255, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(153, 102, 255, 1)",
          "rgba(255, 159, 64, 1)",
          "rgba(153, 102, 255, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(255, 159, 64, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    scales: {
      yAxes: [
        {
          ticks: {
            beginAtZero: true,
          },
        },
      ],
    },
  };

  return (
    <div className="flex flex-column align-center justify-center" style={{height: '100vh'}}>
      <p className="h1 font-main secondary-accent fw-black marginbottom-24">Your chances are <span className="primary-accent">{relationshipToAverage()} the average</span> NU student ({average}%).</p>
      <Bar data={consultantChance} options={options} />
    </div>
  )
}

const careerChoices = [
  'Consulting', 
  'Banking/Finance', 
  'Software Engineering', 
  'other STEM field', 
  'Liberal Arts', 
  'Other', 
  'I do not believe in labor'
]

const CareerChoicesGraph = ({ yourCareerChoice, otherCareerChoices }) => {

  const [mostCommonCareer, setMostCommonCareer] = useState(0)
  
  useEffect(() => {
    let highestSum = -1;
    let highestIdx = -1;

    for (let i = 0; i < otherCareerChoices.length; i += 1) {
      if (otherCareerChoices[i] > highestSum) {
        highestSum = otherCareerChoices[i]
        highestIdx = i
      }
    }

    setMostCommonCareer(highestIdx)
  }, [])

  const careerChance = {
    labels: careerChoices,
    datasets: [
      {
        label: "# of People in Category",
        data: otherCareerChoices,
        backgroundColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(153, 102, 255, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(255, 159, 64, 1)",
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(153, 102, 255, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(255, 159, 64, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    scales: {
      yAxes: [
        {
          ticks: {
            beginAtZero: true,
          },
        },
      ],
    },
  };

  return (
    <div className="flex flex-column align-center justify-center" style={{height: '100vh'}}>
      <p className="h1 font-main secondary-accent fw-black marginbottom-24">{yourCareerChoice === mostCommonCareer ? 'Like' : 'Unlike'} you, most students plan on pursuing a career in <span className="primary-accent">{careerChoices[mostCommonCareer]}.</span></p>
      <Bar data={careerChance} options={options} />
    </div>
  )
}

const Share = () => {

  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    const dummy = document.createElement("textarea");
    // to avoid breaking orgain page when copying more words
    // cant copy when adding below this code
    // dummy.style.display = 'none'
    document.body.appendChild(dummy);
    //Be careful if you use texarea. setAttribute('value', value), which works with "input" does not work with "textarea". – Eduard
    dummy.value = 'https://friendly-jennings-f7e374.netlify.app/';
    dummy.select();
    document.execCommand("copy");
    document.body.removeChild(dummy);
    setCopied(true);
}

  return (
    <div className="flex flex-column align-left justify-center" style={{height: '100vh', textAlign: 'left'}}>
      <p className="h1 font-main primary-accent fw-black marginbottom-24">Data makes the world go round.</p>
      <p className="h1 font-main secondary-accent fw-black marginbottom-24">Help us out by sharing this survey with your friends!</p>
      <div className="padding-16 secondary-accent-background br-reg flex justify-center btn" style={{width: '300px', alignSelf: 'center'}} onClick={copyToClipboard}>
        <p className="font-main h3 white-color fw-medium">{copied ? "Copied!" : "Copy the link"}</p>
      </div>
    </div>
  )
}

export async function getServerSideProps(context) {
  const { id } = context.params;

  return {
    props: {
      id,
    },
  };
}

export default Results;
