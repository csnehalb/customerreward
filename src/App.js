import React, { useState, useEffect, Fragment } from "react"
import "./App.css"
import data from "./data"

function App() {
  const [loadedData, setloadedData] = useState({})
  const [userRewards, setCalcRewards] = useState({})
  const [userTransactions, setUserTransactions] = useState([])
  const [users, setUsers] = useState([])
  const [currentUser, setCurrentUser] = useState("")
  const [newTransaction, setNewTransaction] = useState({
    date: new Date(),
    amount: 0,
  })

  useEffect(() => {
    console.log("Help")
    setloadedData({ ...data })
    setUsers([...Object.keys(data)])
  }, [])

  const userSelect = (value) => {
    setCurrentUser(value)
    let userData = loadedData[value]

    let monthT = {
      8: {
        amounts: [],
        rewards: 0,
      },
      9: {
        amounts: [],
        rewards: 0,
      },
      10: {
        amounts: [],
        rewards: 0,
      },
    }
    console.log(userData)
    for (let i = 0; i < userData.length; i++) {
      let month = new Date(userData[i]["date"])
      console.log("Month=", month.getMonth())
      if (
        month.getMonth() + 1 === 8 ||
        month.getMonth() + 1 === 9 ||
        month.getMonth() + 1 === 10
      ) {
        monthT[month.getMonth() + 1]["amounts"].push(userData[i]["amount"])
      }
    }
    for (let key in monthT) {
      let total_month_rewards = 0
      for (let i = 0; i < monthT[key]["amounts"].length; i++) {
        let price = monthT[key]["amounts"][i]

        total_month_rewards = total_month_rewards + calRew(price)
      }
      monthT[key]["rewards"] = total_month_rewards
    }
    console.log(monthT)
    setCalcRewards({ ...monthT })
    setUserTransactions([...userData])
  }

  const updateInput = (e) => {
    if (e.target.name === "date") {
      setNewTransaction({ ...newTransaction, ...{ date: e.target.value } })
    }
    if (e.target.name === "amount") {
      setNewTransaction({ ...newTransaction, ...{ amount: e.target.value } })
    }
  }

  const btnAddtransaction = () => {
    let data = { ...loadedData }
    let month = new Date(newTransaction["date"])
    if (
      month.getMonth() + 1 === 8 ||
      month.getMonth() + 1 === 9 ||
      month.getMonth() + 1 === 10
    ) {
      data[currentUser].push(newTransaction)
      console.log(data)
      setloadedData({ ...data })

      userSelect(currentUser)
    }
    setNewTransaction({ date: new Date(), amount: 0 })
  }
  return (
    <div
      style={{
        marginTop: "20px",
        marginBottom: "50px",
        fontSize: "20px",
      }}>
      <h2 style={{ textAlign: "center" }}>User Rewards Dashborad</h2>
      <div className='select-style'>
        <select
          onChange={(e) => userSelect(e.target.value)}
          value={currentUser}>
          <option value='' disabled>
            Select User
          </option>
          {users.map((item, index) => {
            return (
              <option key={index} value={item}>
                {" "}
                {item.toUpperCase()}{" "}
              </option>
            )
          })}
        </select>
      </div>
      {Object.keys(userRewards).length > 0 && (
        <Fragment>
          <table className='customers'>
            <thead>
              <tr>
                <th>Month</th>
                <th>Rewards</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>August</td>
                <td>{userRewards[8]["rewards"]}</td>
              </tr>
              <tr>
                <td>September</td>
                <td>{userRewards[9]["rewards"]}</td>
              </tr>
              <tr>
                <td>October</td>
                <td>{userRewards[10]["rewards"]}</td>
              </tr>
              <tr>
                <td>Total Reward</td>
                <td>
                  {userRewards[8]["rewards"] +
                    userRewards[9]["rewards"] +
                    userRewards[10]["rewards"]}
                </td>
              </tr>
            </tbody>
          </table>
          <h4>User Transactions</h4>
          {userTransactions.length > 0 ? (
            <table className='customers'>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Amount</th>
                  <th>Rewards</th>
                </tr>
              </thead>
              <tbody>
                {userTransactions.map((item, index) => {
                  return (
                    <tr key={index}>
                      <td>{item["date"]}</td>
                      <td>{item["amount"]}</td>
                      <td>{calRew(item["amount"])}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          ) : (
            <div>No Transactions Found</div>
          )}
          <div>
            <h4>Add Transactions</h4>
            <h5>Only Transactions of last three months accepted</h5>
            <label>Date : </label>
            <input
              type='date'
              name='date'
              value={newTransaction.date}
              onChange={(e) => updateInput(e)}></input>
            <label>Amount :</label>
            <input
              type='number'
              name='amount'
              value={newTransaction.amount}
              onChange={(e) => updateInput(e)}></input>
            <button onClick={() => btnAddtransaction()}>Add Transaction</button>
          </div>
        </Fragment>
      )}
    </div>
  )
}

export default App

function calRew(price) {
  let rewards = 0
  if (price > 100) {
    rewards = (price - 100) * 2
  }
  if (price > 50) {
    rewards = rewards + (price - 50)
  }
  return rewards
}
