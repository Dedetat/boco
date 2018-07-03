const getWagesDistribution = (state) => {
  const {
    wages,
  } = state

  const totalWages = wages.reduce(
    (acc, curr) => acc + curr.value,
    0,
  )

  return wages.reduce(
    (acc, curr) => ({ ...acc, [curr.name]: curr.value / totalWages }),
    {},
  )
}

const getContributionsBasedOnWages = (state) => {
  const {
    balance,
    wantedBalance,
    wages,
  } = state

  const need = wantedBalance - balance
  if (need <= 0) return []

  return wages.map(({ name }) => ({
    name,
    value: Math.round((getWagesDistribution(state)[name] * need) * 100) / 100,
  }))
}

module.exports = (state) => {
  const {
    balance,
    wantedBalance,
    wages,
    rent,
    monthly,
    rentPayer = 'delphine',
  } = state

  // in case this is not a monthly addition
  // - only the difference between balance and wantedBalance is processed
  // - only the wagesDistribution is used
  // - if the balance >= wantedBalance, then there is nothing to add!
  const need = wantedBalance - balance
  if (!monthly) {
    if (need <= 0) return []
    return getContributionsBasedOnWages(state)
  }

  // this is a monthly addition
  // - rent has always to be paid
  // - the rent payer should add its part (its contribution)
  // - then the balance is completed until the wantedBalance is reached
  const wagesDistribution = getWagesDistribution(state)
  const distribution = wagesDistribution[rentPayer]
  const rentWithContributionAdded = Math.round((rent + ((rent * distribution) / (1 - distribution))) * 100) / 100

  // we add the rent (with corresponding contribution) to the balance
  const contributions = getContributionsBasedOnWages({ ...state, balance: (balance + rentWithContributionAdded) })

  // if this is enough to reach the wanted balance, then we only add that
  if (contributions.length === 0) {
    return wages.map(({ name }) => ({
      name,
      value: name === rentPayer ? rentWithContributionAdded : 0,
    }))
  }

  // otherwise, we add the rent with contribution added to reach the wanted balance
  contributions.find(({ name }) => name === rentPayer).value += rentWithContributionAdded

  return contributions
}
