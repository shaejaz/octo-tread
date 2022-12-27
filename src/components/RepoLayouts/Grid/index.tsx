import React from 'react'
import { Text, Flex, SimpleGrid } from '@chakra-ui/react'

interface Repository {
  id: string
  name: string
  description: string
  author: string
  language: string
  stars: number
}

export function Grid (props: { repos: Repository[] }): JSX.Element {
  return (
    <SimpleGrid columns={{ base: 1, sm: 2, md: 3 }} spacing={4}>
      {props.repos.map((i, idx) =>
        <Flex key={idx} direction={'column'} h={40} border={'1px solid black'}>
          <Text>
            {i.name}
          </Text>
          <Text>
            {i.author}
          </Text>
          <Text>
            {i.description}
          </Text>
          <Text>
            {i.language}
          </Text>
          <Text>
            {i.stars}
          </Text>
        </Flex>
      )}
    </SimpleGrid>
  )
}
