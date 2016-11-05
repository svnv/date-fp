import assert from 'assert'
import of from '../of'

describe('of', () => {
  it('should return a new utc date', () => {
    assert.equal(of([2016, 0, 1]).toISOString(),'2016-01-01T00:00:00.000Z')
  })
  it('should reject invalid dates', () => {
    assert.equal(of([2016, 15, 1]).toString(),'Invalid Date')
  })
})
