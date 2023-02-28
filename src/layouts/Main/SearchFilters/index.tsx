import { Button, Stack, TextField } from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'
import {
  DateRange,
  ResetQueryState,
  generateDateRangeObj,
  resetQuery,
} from '@octotread/services/search-query'
import { RootState } from '@octotread/services/store'
import { LanguageSelection } from './LanguageSelection'
import { TimeFilter } from './TimeFilter'
import { TopicFilter } from './TopicFilter'
import { useEffect } from 'react'
// TODO: gut RHF for custom solution using yup + lodash
import { Controller, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { ObjectSchema, object, string, array, number } from 'yup'

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
  const dispatch = useDispatch()

  const searchText = useSelector((state: RootState) => state.searchquery.searchText)
  const searchLanguages = useSelector((state: RootState) => state.searchquery.language)
  const searchStars = useSelector((state: RootState) => state.searchquery.stars)
  const searchDateRange = useSelector((state: RootState) => state.searchquery.dateRange)
  const searchTopics = useSelector((state: RootState) => state.searchquery.topics)
  const repoItemsPerPage = useSelector((state: RootState) => state.searchquery.itemsPerPage)

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
        newDateObj: generateDateRangeObj(v.dateRange),
      }),
    )
  }

  return (
    <Stack direction='column' spacing={1}>
      <Stack direction='row' alignItems='center' spacing={2}>
        <Controller
          control={control}
          name='searchText'
          render={({ field, fieldState }) => (
            <TextField
              label='Search text'
              {...field}
              error={!!fieldState.error}
              helperText={fieldState.error?.message}
            />
          )}
        />

        <Controller
          control={control}
          name='language'
          render={({ field: { value, onChange } }) => (
            <LanguageSelection value={value} handleValueChange={(l) => onChange(l)} />
          )}
        />

        <Controller
          control={control}
          name='stars'
          render={({ field, fieldState }) => (
            // TODO: only allow numbers to be entered
            <TextField
              placeholder='Min stars'
              error={!!fieldState.error}
              helperText={fieldState.error?.message}
              {...field}
            />
          )}
        />

        <Controller
          control={control}
          name='topics'
          render={({ field: { value, onChange } }) => (
            <TopicFilter value={value} handleValueChange={(v) => onChange(v)} />
          )}
        />

        <Controller
          control={control}
          name='dateRange'
          render={({ field: { value, onChange } }) => (
            <TimeFilter value={value} handleChange={(v) => onChange(v)} />
          )}
        />

        <Controller
          control={control}
          name='itemsPerPage'
          render={({ field, fieldState }) => (
            <TextField
              placeholder='Number of repositories per page'
              error={!!fieldState.error}
              helperText={fieldState.error?.message}
              {...field}
            />
          )}
        />
      </Stack>

      {/* TODO: only enable button when form values have actually changed, not just simple dirty check. will require deep compare */}
      <Button disabled={!isValid || !isDirty} onClick={handleSubmit(handleApplyClick)}>
        Apply
      </Button>
    </Stack>
  )
}
