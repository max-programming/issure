import React from 'react'

import * as S from './Search.style'
import LiquidButton from '@components/LiquidButton'
import { Octokit } from '@octokit/rest'
import Issue from '@components/Issue/Issue'

export type label =
  | string
  | {
      id?: number | undefined
      node_id?: string | undefined
      url?: string | undefined
      name?: string | undefined
      description?: string | null | undefined
      color?: string | null | undefined
      default?: boolean | undefined
    }

const Search: React.FC = () => {
  const octo = new Octokit({})

  const inputRef = React.useRef<HTMLInputElement>(null)

  const [title, setTitle] = React.useState<string>()
  const [description, setDescription] = React.useState<string>()
  const [date, setDate] = React.useState<string>()
  const [author, setAuthor] = React.useState<string>()
  const [link, setLink] = React.useState<string>()
  const [number, setNumber] = React.useState<number>()
  const [tags, setTags] = React.useState<label[]>()

  const [repoDetails, setRepoDetails] = React.useState([''])

  React.useEffect(() => {
    inputRef.current!.addEventListener('change', () => {
      setRepoDetails(inputRef.current!.value.split('/'))
    })
  }, [])

  const FetchIssues = () => {
    octo
      .paginate(octo.issues.listForRepo, {
        owner: 'codemyst',
        repo: 'pastemyst',
      })
      .then((issues) => {
        console.log(repoDetails)

        let issueNumbers = []

        for (let i = 0; i < issues.length; i++) {
          issueNumbers.push(issues[i].number)
        }

        const issueIndex = Math.floor(
          Math.random() * Math.floor(issueNumbers.length)
        )

        setTitle(issues[issueIndex].title)
        setDescription(issues[issueIndex].body_text)
        setDate(issues[issueIndex].created_at)
        setAuthor(issues[issueIndex].user?.login)
        setLink(issues[issueIndex].html_url)
        setNumber(issues[issueIndex].number)
        setTags(issues[issueIndex].labels)

        console.log(issues[issueIndex].labels)
      })
  }

  return (
    <S.SearchContainer>
      <S.SearchInput
        placeholder='URL, or username/repo'
        spellCheck='false'
        ref={inputRef}
      />
      <LiquidButton GetIssues={FetchIssues} />
      {title == undefined ? (
        ''
      ) : (
        <Issue
          title={title!}
          date={date!}
          author={author!}
          link={link!}
          number={number!}
          labels={tags!}
        />
      )}
    </S.SearchContainer>
  )
}

export default Search
