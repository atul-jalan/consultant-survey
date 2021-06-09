import { useEffect, useState } from "react";
import fire from "../../config/fire-config";
import React from "react";
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
        cDist[values[i].ANSWER] += 1;
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

  const consultantChance = {
    labels: [
      "0-10",
      "10-20",
      "30-40",
      "40-50",
      "50-60",
      "60-70",
      "80-90",
      "90-100",
    ],
    datasets: [
      {
        label: "# of People in Category",
        data: data,
        backgroundColor: [
          "rgba(255, 99, 132, 0.2)",
          "rgba(54, 162, 235, 0.2)",
          "rgba(255, 206, 86, 0.2)",
          "rgba(75, 192, 192, 0.2)",
          "rgba(153, 102, 255, 0.2)",
          "rgba(255, 159, 64, 0.2)",
          "rgba(153, 102, 255, 0.2)",
          "rgba(255, 159, 64, 0.2)",
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(153, 102, 255, 1)",
          "rgba(255, 159, 64, 1)",
          "rgba(153, 102, 255, 1)",
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

  if (isLoading) return <p>Loading...</p>;

  return (
    <div className="flex justify-center align-center bg-color-background padding-32">
      <div className="font-main flex justify-center align-center">
        <p className="font-main h1 fw-black primary-accent">
          <span className="secondary-accent">
            Your chances of becoming a consultant:{" "}
          </span>
          {Math.round(data[id].RESULT)}%
        </p>
        <Bar data={consultantChance} options={options} />
      </div>
    </div>
  );
};

export async function getServerSideProps(context) {
  const { id } = context.params;

  return {
    props: {
      id,
    },
  };
}

export default Results;
