/* eslint-env jest */
const getContributions = require('./getContributions')

describe('getContributions', () => {
  const test = state => expected => expect(getContributions(state)).toMatchObject(expected)

  it('should not add contributions -balance is ok, and not monthly-', () => {
    test({
      monthly: false,
      balance: 400,
      wantedBalance: 400,
    })([])

    test({
      monthly: false,
      balance: 400,
      wantedBalance: 300,
    })([])
  })

  it('should ask for contributions -not monthly-', () => {
    test({
      monthly: false,
      balance: 0,
      wantedBalance: 100,
      wages: [
        { name: 'delphine', value: 60 },
        { name: 'fabien', value: 40 },
      ],
    })([
      { name: 'delphine', value: 60 },
      { name: 'fabien', value: 40 },
    ])

    test({
      monthly: false,
      balance: 10,
      wantedBalance: 100,
      wages: [
        { name: 'delphine', value: 60 },
        { name: 'fabien', value: 40 },
      ],
    })([
      { name: 'delphine', value: 54 },
      { name: 'fabien', value: 36 }, // sum is 90, 40% of 90 is 36
    ])
  })

  it('should ask for contribution -rent, montly-', () => {
    // the rent should be added in all cases
    test({
      monthly: true,
      balance: 1000,
      wantedBalance: 0,
      rent: 500,
      wages: [
        { name: 'delphine', value: 60 },
        { name: 'fabien', value: 40 },
      ],
    })([
      { name: 'delphine', value: 1250 }, // (rent 500) + (contribution based on rent: 750)
      { name: 'fabien', value: 0 },
    ])

    // the rent is enough to reach wantedBalance
    test({
      monthly: true,
      balance: 0,
      wantedBalance: 1000,
      rent: 500,
      wages: [
        { name: 'delphine', value: 60 },
        { name: 'fabien', value: 40 },
      ],
    })([
      { name: 'delphine', value: 1250 }, // (rent 500) + (contribution based on rent: 750)
      { name: 'fabien', value: 0 },
    ])

    // we should add more than the rent
    test({
      monthly: true,
      balance: 0,
      wantedBalance: 1100,
      rent: 500,
      wages: [
        { name: 'delphine', value: 40 },
        { name: 'fabien', value: 60 },
      ],
    })([
      { name: 'delphine', value: 940 }, // (rent 500) + (contribution based on rent: 333.33) + (contribution to reach balance: 106.8)
      { name: 'fabien', value: 160 }, // (contribution to reach balance: 160.2)
    ])
  })
})
