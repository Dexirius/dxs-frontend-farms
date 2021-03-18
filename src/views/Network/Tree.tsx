import React, { useState } from 'react'
// import { useSelector } from 'react-redux'
// import { withRouter } from 'react-router-dom'
import { Text } from '@pancakeswap-libs/uikit'
import imgBinary from '../../config/img/binary.png'

interface jsonProps {
  id: string
  address: string
  children: any
  title: string
  innerWidth: any
}

interface TreeProps {
  json: jsonProps
  ancho: any
  m: any
}

const Tree: React.FC<TreeProps> = ({ json, ancho, m }) => {
  const [val, setVal] = useState(0)

  const tdMain = () => {
    return json.children ? json.children.length * 2 : 1
  }

  const getClassChilden = () => {
    let c = ''
    if (json.children.length > 0) {
      c = 'parentLevel extend'
    }
    return c
  }

  const viewRow = (k, v) => {
    const nameContainer = `viewRow_ ${Math.random()}`
    return (
      <td key={nameContainer} colSpan={2} className="childLevel">
        <Tree json={v} ancho={ancho} m={m} />
      </td>
    )
  }

  const getChildren = async (e) => {
    if (e.children.length <= 0) {
      await m.methods
        .members(e.address)
        .call()
        .then(async (result) => {
          if (result.referredUsers > 0) {
            /* eslint-disable no-await-in-loop */
            for (let i = 0; i < result.referredUsers; i++) {
              await m.methods
                .memberChild(result.id, i)
                .call()
                .then(async (rm) => {
                  await m.methods
                    .members(rm)
                    .call()
                    .then(async (r) => {
                      if (r.isExist === true && e.address !== rm) {
                        e.children.push({
                          id: rm,
                          address: rm,
                          children: [],
                          title: rm,
                          innerWidth: ancho,
                        })
                      }
                    })
                })
            }
          }
        })
      setVal(Math.random())
    }
  }

  const openAddr = (addr) => {
    window.open(`https://bscscan.com/address/${addr}`)
  }

  return (
    <>
      {json.id !== '' && (
        <table>
          <tbody>
            <tr>
              <td colSpan={tdMain()} className={`${getClassChilden()}`}>
                <div className="node">
                  <div className="person">
                    <div className="avat click" role="presentation" id={json.address} onClick={() => getChildren(json)}>
                      <img src={imgBinary} alt="" />
                    </div>
                    <div className="id click addr_net" role="presentation" onClick={() => openAddr(json.address)}>
                      <Text>
                        {json.address.substr(0, 6)}...{json.address.substr(-4)}{' '}
                      </Text>
                    </div>
                  </div>
                </div>
              </td>
            </tr>
            {json.children.length > 0 && (
              <>
                <tr>
                  {val >= 0 &&
                    json.children !== null &&
                    json.children.length > 0 &&
                    json.children.map((value, key) => viewRow(key, value))}
                </tr>
              </>
            )}
          </tbody>
        </table>
      )}
    </>
  )
}

export default Tree
