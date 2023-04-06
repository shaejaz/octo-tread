import { Box, Button, Collapse, Paper, Stack } from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'
import { ResetQueryState, resetQuery } from '@octotread/services/search-query'
import { RootState } from '@octotread/services/store'
import { LanguageSelection } from './LanguageSelection'
import { TimeFilter } from './TimeFilter'
import { TopicFilter } from './TopicFilter'
import { useEffect, useState } from 'react'
// TODO: gut RHF for custom solution using yup + lodash
import { Controller, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { ObjectSchema, object, string, array, number } from 'yup'
import { DateRange } from '@octotread/models/dateRange'
import { generateDateStartEnd } from '@octotread/utils/dates'
import { Input } from '@octotread/components/Input'
import { Icon } from '@iconify/react'
import { RepoGroupDateHeader } from '@octotread/components/RepoGroupDateHeader'

const schema: ObjectSchema<ResetQueryState> = object({
  searchText: string().optional(),
  dateRange: string<DateRange>().required(),
  language: array().of(string().required()).required(),
  topics: array().of(string().required()).required(),
  stars: number().required('Number should be provided').typeError('Number should be provided'),
  itemsPerPage: number()
    .required('Number should be provided')
    .typeError('Number should be provided')
    .min(6)
    .max(30),
})

export function SearchFilters() {
  const [showFilters, setShowFilters] = useState(false)

  const dispatch = useDispatch()

  const searchText = useSelector((state: RootState) => state.searchquery.searchText)
  const searchLanguages = useSelector((state: RootState) => state.searchquery.language)
  const searchStars = useSelector((state: RootState) => state.searchquery.stars)
  const searchDateRange = useSelector((state: RootState) => state.searchquery.dateRange)
  const searchTopics = useSelector((state: RootState) => state.searchquery.topics)
  const repoItemsPerPage = useSelector((state: RootState) => state.searchquery.itemsPerPage)

  const dates = useSelector((state: RootState) => state.searchquery.datesToFetch)

  const {
    control,
    trigger,
    formState: { isDirty, isValid, isSubmitSuccessful },
    getValues,
    handleSubmit,
    reset,
  } = useForm<ResetQueryState>({
    resolver: yupResolver(schema),
    mode: 'all',
    reValidateMode: 'onChange',
    defaultValues: {
      searchText: searchText,
      language: searchLanguages,
      stars: searchStars,
      dateRange: searchDateRange,
      itemsPerPage: repoItemsPerPage,
      topics: searchTopics,
    },
  })

  useEffect(() => {
    trigger()
  }, [trigger])

  useEffect(() => {
    if (isSubmitSuccessful) {
      reset({ ...getValues() })
    }
  }, [isSubmitSuccessful, reset, getValues])

  const handleApplyClick = () => {
    const v = getValues()
    dispatch(
      resetQuery({
        state: {
          ...v,
          // react-hook-form does not have a way to automatically convert to int :(
          stars: parseInt(v.stars as unknown as string, 10),
          itemsPerPage: parseInt(v.itemsPerPage as unknown as string, 10),
        },
        newDateObj: generateDateStartEnd(v.dateRange),
      }),
    )
  }

  return (
    <Stack direction='column'>
      <Collapse in={showFilters}>
        <Paper component={Stack} direction='column' spacing={3} sx={{ px: 2, pt: 2, pb: 3 }}>
          <Stack direction='row' justifyContent='space-between' spacing={3}>
            <Controller
              control={control}
              name='searchText'
              render={({ field, fieldState }) => (
                <Input
                  {...field}
                  label='Search text'
                  error={!!fieldState.error}
                  helperText={fieldState.error?.message}
                  placeholder='javascript'
                  tooltipText='Keywords to search in the repositories name, description and readme file.'
                  sx={{ flex: '0 1 20rem' }}
                />
              )}
            />

            <Stack direction='row' justifyContent='flex-end' spacing={3} flex='0 1 auto'>
              <Controller
                control={control}
                name='dateRange'
                render={({ field: { value, onChange } }) => (
                  <TimeFilter
                    value={value}
                    handleChange={(v) => onChange(v)}
                    containerProps={{ sx: { flex: '0 0 8rem' } }}
                  />
                )}
              />

              <Controller
                control={control}
                name='stars'
                render={({ field, fieldState }) => (
                  // TODO: only allow numbers to be entered
                  <Input
                    {...field}
                    label='Min stars'
                    error={!!fieldState.error}
                    helperText={fieldState.error?.message}
                    sx={{ flex: '0 1 8rem' }}
                  />
                )}
              />

              <Controller
                control={control}
                name='itemsPerPage'
                render={({ field, fieldState }) => (
                  <Input
                    {...field}
                    label='Items per page'
                    error={!!fieldState.error}
                    helperText={fieldState.error?.message}
                    sx={{ flex: '0 1 10rem' }}
                  />
                )}
              />
            </Stack>
          </Stack>

          <Stack direction='row' alignItems='flex-end'>
            <Stack direction='row' flex='1' spacing={3}>
              <Controller
                control={control}
                name='language'
                render={({ field: { value, onChange } }) => (
                  <LanguageSelection
                    value={value}
                    handleValueChange={(l) => onChange(l)}
                    containerProps={{ sx: { flex: '0 0 30rem' } }}
                  />
                )}
              />

              <Controller
                control={control}
                name='topics'
                render={({ field: { onChange } }) => (
                  <TopicFilter
                    handleValueChange={(v) => onChange(v)}
                    containerProps={{ sx: { flex: '0 0 30rem' } }}
                  />
                )}
              />
            </Stack>

            <Box mr={2} mb={2}>
              {/* TODO: only enable button when form values have actually changed, not just simple dirty check. will require deep compare */}
              <Button
                variant='contained'
                disabled={!isValid || !isDirty}
                onClick={handleSubmit(handleApplyClick)}
              >
                Apply
              </Button>
            </Box>
          </Stack>
        </Paper>
      </Collapse>

      <Stack
        direction='row'
        alignItems='flex-end'
        justifyContent={dates.length ? 'space-between' : 'flex-end'}
        mt={showFilters ? 3 : 0}
      >
        {dates.length > 0 && <RepoGroupDateHeader dateStartEnd={dates[0]} />}

        <Button
          variant='outlined'
          endIcon={
            <Icon
              icon={
                showFilters ? 'material-symbols:arrow-drop-up' : 'material-symbols:arrow-drop-down'
              }
            />
          }
          onClick={() => setShowFilters((prev) => !prev)}
        >
          Show filters
        </Button>
      </Stack>
    </Stack>
  )
}
