import React from 'react'
import { Flex, Heading, Text } from '@chakra-ui/react'

export function Toolbar (): JSX.Element {
  return (
    <Flex as={'nav'} bg={'gray.400'} width={'full'} justify={'center'}>
      <Flex flex={1} justify={'space-between'} align={'center'} px={6} py={4} maxW={'6xl'}>
        <Heading as={'h3'} fontSize={'2xl'}>
          Octotread
        </Heading>

        <Flex display={{ base: 'none', md: 'flex' }} ml={10}>
          <Text>
            Navbar
          </Text>
        </Flex>
      </Flex>
    </Flex>
  )
}
