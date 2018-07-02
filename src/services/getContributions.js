const getContributionsBasedOnWages = ({ balance, wantedBalance, wages }) => {
  const need = wantedBalance - balance
  if (need <= 0) return []

  const totalWages = wages.reduce(
    (acc, curr) => acc + curr.value,
    0,
  )

  const wagesDistribution = wages.reduce(
    (acc, curr) => ({ ...acc, [curr.name]: curr.value / totalWages }),
    {},
  )

  return wages.map(({ name }) => ({
    name,
    value: Math.round((wagesDistribution[name] * need) * 100) / 100,
  }))
}

module.exports = (state) => {
  const {
    balance,
    wantedBalance,
    wages,
    rent,
    monthly,
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
  // - we add rent * number of person into the balance, since the balance is shared along all persons
  // - if this is enough, then only the person that pay rent should add to the common account
  // - if this is NOT enough, then we share the rest, and the person who pay the rent should pay the rent :)
  const contributions = getContributionsBasedOnWages({ ...state, balance: balance + (rent * wages.length) })
  if (contributions.length === 0) {
    return [
      { name: 'delphine', value: (rent * wages.length) },
      { name: 'fabien', value: 0 },
    ]
  }

  // add the rent
  contributions.find(({ name }) => name === 'delphine').value += (rent * wages.length)

  return contributions
}
